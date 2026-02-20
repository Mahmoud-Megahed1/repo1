import {
    Injectable,
    HttpException,
    HttpStatus,
    Logger,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderRepo } from './repo/order.repo';
import { TransactionService } from '../common/database/transaction.service';
import { UserRepo } from '../user/repo/user.repo';
import { MailService } from '../common/mail/mail.service';
import { FrontendRedirectService } from '../common/services/frontend-redirect.service';
import { PaymentRequest, PaymentStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TamaraService {
    private readonly logger = new Logger(TamaraService.name);
    private readonly TAMARA_API_TOKEN: string;
    private readonly TAMARA_NOTIFICATION_TOKEN: string;
    private readonly TAMARA_PUBLIC_KEY: string;
    private readonly TAMARA_API_URL: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly orderRepo: OrderRepo,
        private readonly transactionService: TransactionService,
        private readonly userRepo: UserRepo,
        private readonly emailService: MailService,
        private readonly frontendRedirectService: FrontendRedirectService,
    ) {
        this.TAMARA_API_TOKEN = this.configService.get<string>('TAMARA_API_TOKEN');
        this.TAMARA_NOTIFICATION_TOKEN = this.configService.get<string>('TAMARA_NOTIFICATION_TOKEN');
        this.TAMARA_PUBLIC_KEY = this.configService.get<string>('TAMARA_PUBLIC_KEY');

        // Determine Environment (Sandbox vs Production) - Defaulting to Production based on user request
        const isSandbox = this.configService.get<string>('TAMARA_ENV') === 'sandbox';
        this.TAMARA_API_URL = isSandbox
            ? 'https://api-sandbox.tamara.co'
            : 'https://api.tamara.co';
    }

    /**
     * Create a Checkout Session with Tamara
     */
    async createCheckoutSession(
        paymentRequest: PaymentRequest,
        userId: string,
    ): Promise<string> {
        return await this.transactionService.withTransaction(async (session) => {
            const { amount, items } = paymentRequest;
            const levelName = items[0].name;

            if (!items?.length || !levelName) {
                throw new BadRequestException('Invalid items in payment request');
            }

            // Check for existing active course
            const existingOrder = await this.orderRepo.findActiveCompletedOrder(
                userId,
                levelName,
                session,
            );

            if (existingOrder) {
                throw new BadRequestException('User already owns this course');
            }

            const user = await this.userRepo.findOne({ _id: userId });
            if (!user) throw new NotFoundException('User not found');

            // Generate a unique Order Reference ID
            const orderRefId = uuidv4();

            // Upsert Order in DB (PENDING)
            const order = await this.orderRepo.upsertOrder(
                userId,
                levelName,
                amount,
                session,
            );

            // Prepare Tamara Payload
            const payload = {
                total_amount: {
                    amount: amount,
                    currency: 'SAR',
                },
                shipping_amount: {
                    amount: 0,
                    currency: 'SAR',
                },
                tax_amount: {
                    amount: 0,
                    currency: 'SAR',
                },
                order_reference_id: orderRefId,
                order_number: order._id.toString(),
                discount: {
                    name: 'Null',
                    amount: {
                        amount: 0,
                        currency: 'SAR',
                    },
                },
                items: items.map(item => ({
                    name: item.name,
                    type: 'Digital',
                    reference_id: item.name,
                    sku: item.name,
                    quantity: 1,
                    discount_amount: {
                        amount: 0,
                        currency: 'SAR',
                    },
                    tax_amount: {
                        amount: 0,
                        currency: 'SAR',
                    },
                    total_amount: {
                        amount: amount,
                        currency: 'SAR',
                    },
                    unit_price: {
                        amount: amount,
                        currency: 'SAR',
                    },
                })),
                consumer: {
                    first_name: user.firstName || 'Guest',
                    last_name: user.lastName || 'User',
                    phone_number: user.phone || '0500000000', // Tamara requires phone
                    email: user.email,
                },
                country_code: 'SA',
                description: `Payment for ${levelName}`,
                merchant_url: {
                    success: `${this.configService.get('FRONTEND_URL')}/payment/tamara/success?orderId=${orderRefId}`,
                    failure: `${this.configService.get('FRONTEND_URL')}/payment/tamara/failure`,
                    cancel: `${this.configService.get('FRONTEND_URL')}/payment/tamara/cancel`,
                    notification: `${this.configService.get('BASE_URL')}/payment/tamara/webhook`,
                },
                payment_type: 'PAY_BY_INSTALMENTS',
            };

            try {
                this.logger.debug(`Tamara Checkout Payload: ${JSON.stringify(payload, null, 2)}`);

                const response = await fetch(`${this.TAMARA_API_URL}/checkout/create-checkout-session`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.TAMARA_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    this.logger.error(`Tamara API Error: ${errorText}`);
                    throw new InternalServerErrorException(`Tamara Checkout Failed: ${errorText}`);
                }

                const data = await response.json();

                // Log the response for debugging
                this.logger.log(`Tamara Checkout Created: ${JSON.stringify(data)}`);

                // Update order with Tamara Order ID
                if (data.order_id) {
                    await this.orderRepo.updateOrderStatus(
                        order._id.toString(),
                        PaymentStatus.PENDING,
                        data.order_id,
                        session
                    );
                }

                return data.checkout_url;
            } catch (error) {
                this.logger.error('Failed to create Tamara session', error);
                throw new InternalServerErrorException(error.message || 'Tamara Checkout Error');
            }
        });
    }

    /**
     * Handle Webhook / Notification
     */
    async handleWebhook(payload: any, token: string): Promise<void> {
        if (token !== this.TAMARA_NOTIFICATION_TOKEN) {
            this.logger.warn(`Invalid Notification Token: ${token}`);
            throw new ForbiddenException('Invalid Notification Token');
        }

        const { order_reference_id, payment_status, tamara_order_id } = payload;
        this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);

        if (payment_status === 'approved' || payment_status === 'authorised') {
            await this.authorizeOrder(tamara_order_id);
        }
    }

    /**
     * Authorize Order (Capture/Verify)
     */
    async authorizeOrder(tamaraOrderId: string) {
        // Find order by paymentId
        const order = await this.orderRepo.findOne({ paymentId: tamaraOrderId });
        if (!order) {
            this.logger.warn(`Order not found for Tamara ID: ${tamaraOrderId}`);
            return;
        }

        if (order.paymentStatus === PaymentStatus.COMPLETED) return;

        await this.orderRepo.updateOrderStatus(
            order._id.toString(),
            PaymentStatus.COMPLETED,
            tamaraOrderId
        );

        this.logger.log(`Order ${order._id} marked as COMPLETED via Tamara`);

        // Fetch user to send email
        const user = await this.userRepo.findOne({ _id: order.userId });
        if (user) {
            // Reuse PaymobService's email logic principle (send success email)
            // Ideally this should be in a shared service, but I'll inject MailService directly.
            await this.sendSuccessEmail(user, order.levelName, order.amount, tamaraOrderId);
        }
    }

    private async sendSuccessEmail(user: any, levelName: string, amount: number, orderId: string) {
        try {
            const paymentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Get course URL for payment success email
            const courseUrl =
                this.frontendRedirectService.getPaymentSuccessUrl(levelName);

            // Simple Email Template for now (or load file if possible)
            const emailContent = `
                <h1>Payment Successful!</h1>
                <p>Hi ${user.firstName},</p>
                <p>Congratulations! Your payment for <strong>${levelName}</strong> has been successfully processed via Tamara.</p>
                <p>Amount: ${amount} SAR</p>
                <p>Reference: ${orderId}</p>
                <p><a href="${courseUrl}">Go to Course</a></p>
              `;

            const mailOptions = {
                to: user.email,
                subject: `🎉 Payment Successful - Welcome to ${levelName} Level!`,
                htmlContent: emailContent,
            };

            await this.emailService.sendCustomEmail(mailOptions);
        } catch (error) {
            this.logger.error(`Failed to send success email`, error);
        }
    }
}
