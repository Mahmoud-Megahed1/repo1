import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { Order } from '../models/order.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Level_Name } from '../../common/shared/enums';
import { PaymentStatus, OrderAccessStatus } from '../types';
import { OrderService } from '../../common/shared/services/order.service';
import { toObjectId } from '../../common/utils/mongoose.utils';

@Injectable()
export class OrderRepo extends AbstractRepo<Order> implements OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }

  async getNumberOfEachCourse() {
    try {
      const orders = await this.orderModel.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: '$levelName',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            levelName: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      return orders;
    } catch (error) {
      throw new Error(`Failed to get number of each course: ${error.message}`);
    }
  }

  async findPendingOrder(
    userId: string,
    levelName: Level_Name,
    session?: ClientSession,
  ): Promise<Order | null> {
    // Convert userId to ObjectId
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .findOne({
        userId: userIdObjectId,
        levelName,
        paymentStatus: PaymentStatus.PENDING,
      })
      .session(session || null);
  }

  // Get most recent pending order for a user, used as a fallback when exact match fails
  async findMostRecentPendingOrder(
    userId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .findOne({ userId: userIdObjectId, paymentStatus: PaymentStatus.PENDING })
      .session(session || null)
      .sort({ updatedAt: -1, createdAt: -1 });
  }

  async findCompletedOrder(
    userId: string,
    levelName: Level_Name | string,
    session?: ClientSession,
  ): Promise<Order | null> {
    // Convert userId to ObjectId
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .findOne({
        userId: userIdObjectId,
        levelName,
        paymentStatus: PaymentStatus.COMPLETED,
      })
      .session(session || null)
      .sort({ createdAt: -1 }); // Get the most recent completed order
  }

  /**
   * Find an active (not expired) completed order for a user and level
   * This prevents duplicate purchases only if the user has an active subscription
   */
  async findActiveCompletedOrder(
    userId: string,
    levelName: Level_Name | string,
    session?: ClientSession,
  ): Promise<Order | null> {
    // Convert userId to ObjectId
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .findOne({
        userId: userIdObjectId,
        levelName,
        paymentStatus: PaymentStatus.COMPLETED,
        accessStatus: OrderAccessStatus.ACTIVE,
      })
      .session(session || null)
      .sort({ createdAt: -1 }); // Get the most recent active completed order
  }

  /**
   * Find ANY active completed order for a user across all levels
   * Used to enforce "one active course at a time" restriction
   */
  async findAnyActiveCompletedOrder(
    userId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .findOne({
        userId: userIdObjectId,
        paymentStatus: PaymentStatus.COMPLETED,
        accessStatus: OrderAccessStatus.ACTIVE,
      })
      .session(session || null)
      .sort({ createdAt: -1 });
  }

  async findUserCompletedOrders(
    userId: string,
    session?: ClientSession,
  ): Promise<Order[]> {
    // Convert userId to ObjectId
    const userIdObjectId = toObjectId(userId);

    return await this.orderModel
      .find({
        userId: userIdObjectId,
        paymentStatus: PaymentStatus.COMPLETED,
      })
      .session(session || null);
  }

  async updateOrderStatus(
    orderId: string,
    status: PaymentStatus,
    paymentId?: string,
    session?: ClientSession,
  ): Promise<Order | null> {
    // Convert orderId to ObjectId
    const orderIdObjectId = toObjectId(orderId);

    const updateData: any = { paymentStatus: status };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    // When marking as COMPLETED, initialize accessExpiresAt (60 days from paymentDate)
    if (status === PaymentStatus.COMPLETED) {
      const now = new Date();
      updateData.paymentDate = now;
      updateData.accessStatus = OrderAccessStatus.ACTIVE;
      updateData.accessExpiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

      try {
        const order = await this.orderModel.findById(orderIdObjectId).session(session || null);
        if (order) {
          const previousOrder = await this.orderModel.findOne({
            userId: order.userId,
            levelName: order.levelName,
            paymentStatus: PaymentStatus.COMPLETED,
            _id: { $ne: order._id }
          }).sort({ paymentDate: -1 }).session(session || null);

          if (previousOrder) {
            const user = await this.orderModel.db.model('User').findById(order.userId).session(session || null);
            if (user) {
              const purchaseDate = new Date(previousOrder.paymentDate || previousOrder.createdAt);
              let totalPausedDays = (user as any).totalPausedDays || 0;
              if ((user as any).pauseStartedAt) {
                const currentPauseDuration = Math.max(0, Math.floor((now.getTime() - new Date((user as any).pauseStartedAt).getTime()) / (1000 * 60 * 60 * 24)));
                totalPausedDays += currentPauseDuration;
              }
              const previousExpiresAt = new Date(purchaseDate.getTime() + (60 + (previousOrder.carriedOverDays || 0) + totalPausedDays + ((user as any).adminGrantedDays || 0)) * 24 * 60 * 60 * 1000);
              
              if (previousExpiresAt > now) {
                const daysLeft = Math.floor((previousExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                updateData.carriedOverDays = Math.max(0, daysLeft);
                updateData.accessExpiresAt = new Date(now.getTime() + (60 + updateData.carriedOverDays) * 24 * 60 * 60 * 1000);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error calculating carriedOverDays', err);
      }
    }

    return await this.orderModel.findByIdAndUpdate(
      orderIdObjectId,
      updateData,
      { new: true, session: session || null },
    );
  }

  async deleteOrdersForLevel(
    userId: string | Types.ObjectId,
    levelName: string,
    session?: ClientSession,
  ) {
    const userIdObjectId = toObjectId(userId as any);
    return await this.orderModel.deleteMany(
      { userId: userIdObjectId, levelName },
      { session: session || null },
    );
  }

  async upsertOrder(
    userId: string,
    levelName: Level_Name,
    amount: number,
    session?: ClientSession,
  ): Promise<Order> {
    try {
      // Convert userId to ObjectId
      const userIdObjectId = toObjectId(userId);

      // Check if there's already a pending order for this user and level
      const existingPendingOrder = await this.orderModel
        .findOne({
          userId: userIdObjectId,
          levelName,
          paymentStatus: PaymentStatus.PENDING,
        })
        .session(session || null);

      if (existingPendingOrder) {
        // Update the existing pending order
        const updatedOrder = await this.orderModel.findByIdAndUpdate(
          existingPendingOrder._id,
          {
            amount,
            paymentDate: new Date(),
          },
          { new: true, session: session || null },
        );

        if (!updatedOrder) {
          throw new Error('Failed to update existing pending order');
        }

        return updatedOrder;
      }

      // Create a new order if no pending order exists using the AbstractRepo's create method
      const newOrder = await this.create(
        {
          userId: userIdObjectId as any, // Cast to avoid TypeScript issues with ObjectId vs User
          levelName,
          amount,
          paymentStatus: PaymentStatus.PENDING,
          paymentDate: new Date(),
          accessStatus: OrderAccessStatus.ACTIVE,
        },
        session,
      );

      if (!newOrder) {
        throw new Error('Failed to create new order');
      }

      return newOrder;
    } catch (error) {
      this.logger.error(`Error in upsertOrder: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findMostRecentOrder(
    userId: string,
    levelName?: Level_Name,
    session?: ClientSession,
  ): Promise<Order | null> {
    // Convert userId to ObjectId
    const userIdObjectId = toObjectId(userId);

    const filter: any = { userId: userIdObjectId };
    if (levelName) {
      filter.levelName = levelName;
    }

    return await this.orderModel
      .findOne(filter)
      .populate('userId')
      .session(session || null)
      .sort({ createdAt: -1 });
  }

  async getRecentOrdersWithUsers(limit: number = 10): Promise<Order[]> {
    return await this.orderModel
      .find({
        paymentStatus: PaymentStatus.COMPLETED,
      })
      .populate({
        path: 'userId',
        select: 'firstName lastName email',
      })
      .sort({ createdAt: -1, paymentDate: -1 })
      .limit(limit)
      .exec();
  }

  // Find all orders with populated user (no pagination) for reports
  async findWithUsers(filter: Record<string, any>): Promise<any[]> {
    return await this.orderModel
      .find(filter)
      .populate({ path: 'userId', select: 'firstName lastName email' })
      .sort({ createdAt: -1 })
      .lean(true)
      .exec();
  }

  // Generic pagination with populated user for admin search/reporting
  async findWithUserPagination(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate({ path: 'userId', select: 'firstName lastName email' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(true),
      this.orderModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Bulk mark orders as EXPIRED where cutoff reached
  async markExpiredOrdersCutoff(cutoffDate: Date): Promise<number> {
    const res = await this.orderModel.updateMany(
      {
        paymentStatus: PaymentStatus.COMPLETED,
        accessStatus: OrderAccessStatus.ACTIVE,
        accessExpiresAt: { $lte: cutoffDate },
      },
      {
        $set: { accessStatus: OrderAccessStatus.EXPIRED },
      },
    );
    return res.modifiedCount || 0;
  }

  async findExpiredOrders(page: number = 1, limit: number = 20, levelName?: Level_Name): Promise<Order[]> {
    const filter: any = {
      paymentStatus: PaymentStatus.COMPLETED,
      accessStatus: OrderAccessStatus.EXPIRED,
    };
    if (levelName) filter.levelName = levelName;

    return await this.orderModel
      .find(filter)
      .populate({ path: 'userId', select: 'firstName lastName email' })
      .sort({ accessExpiresAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countOrdersByAccessStatus(): Promise<{ ACTIVE: number; EXPIRED: number }> {
    const agg = await this.orderModel.aggregate([
      {
        $match: { paymentStatus: PaymentStatus.COMPLETED },
      },
      {
        $group: {
          _id: '$accessStatus',
          count: { $sum: 1 },
        },
      },
    ]);
    const result = { ACTIVE: 0, EXPIRED: 0 } as { ACTIVE: number; EXPIRED: number };
    for (const row of agg) {
      if (row._id === OrderAccessStatus.ACTIVE) result.ACTIVE = row.count;
      if (row._id === OrderAccessStatus.EXPIRED) result.EXPIRED = row.count;
    }
    return result;
  }

  // Delete pending orders older than the specified date
  async deletePendingOrdersOlderThan(cutoffDate: Date): Promise<number> {
    const result = await this.orderModel.deleteMany({
      paymentStatus: PaymentStatus.PENDING,
      createdAt: { $lt: cutoffDate },
    });
    return result.deletedCount || 0;
  }
}
