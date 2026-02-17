import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    UseGuards,
    BadRequestException,
    Req,
    NotFoundException,
} from '@nestjs/common';
import { TamaraService } from './tamara.service';
import { PaymentRequestDto } from './dto/orderData';
import { CurrentUser } from '../user-auth/decorator/get-curr-user.decorator';
import { User } from '../user/models/user.schema';
import { UserJwtGuard } from '../user-auth/guards/user-jwt.guard';
import { Public } from '../user-auth/decorator/public.decorator';
import { ConfigService } from '@nestjs/config';
import { CourseService } from '../course/course.service';

@Controller('payment/tamara')
export class TamaraController {
    constructor(
        private readonly tamaraService: TamaraService,
        private readonly configService: ConfigService,
        private readonly courseService: CourseService
    ) { }

    @UseGuards(UserJwtGuard)
    @Post('checkout')
    async checkout(
        @Body() paymentDto: PaymentRequestDto,
        @CurrentUser() user: User,
    ) {
        if (!user) throw new BadRequestException('User required');

        // Fetch real course price
        const course = await this.courseService.findByLevelName(paymentDto.level_name);
        if (!course) throw new NotFoundException('Course not found');

        const price = course.price;

        // Basic mapping satisfying PaymentRequest interface
        const paymentRequest = {
            amount: price,
            currency: 'SAR',
            payment_methods: [0], // Dummy
            billing_data: {
                apartment: 'NA',
                first_name: user.firstName,
                last_name: user.lastName,
                street: 'NA',
                building: 'NA',
                phone_number: user.phone || '+966500000000',
                city: 'Riyadh',
                country: 'SA',
                email: user.email,
                floor: 'NA',
                state: 'NA',
            },
            items: [
                {
                    name: paymentDto.level_name,
                    amount: price,
                    description: `Course ${paymentDto.level_name}`,
                    quantity: 1,
                }
            ]
        };

        return {
            checkoutUrl: await this.tamaraService.createCheckoutSession(paymentRequest, user._id.toString())
        };
    }

    @Public()
    @Post('webhook')
    async webhook(@Body() payload: any, @Query('token') token: string) {
        // Tamara verifies receiving the notification
        await this.tamaraService.handleWebhook(payload, token);
        return { status: 'success' };
    }
}
