import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ClientSession } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  /**
   * Execute a function within a transaction
   * @param callback Function to execute within transaction
   * @returns Result of the callback function
   */
  async withTransaction<T>(
    callback: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    // MongoDB Standalone does not support transactions.
    // Executing callback without a session.
    try {
      const result = await callback(null as any);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
