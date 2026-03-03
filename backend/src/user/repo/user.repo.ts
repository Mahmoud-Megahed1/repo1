import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { User } from '../models/user.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Level_Name } from '../../common/shared/enums';
import { UserProgress } from '../models/user-progress.schema';
import { Day } from '../models/day.schema';
import { Task } from '../models/task.schema';
import { UserTask } from '../models/user-task.schema';
import { Level } from '../models/level.schema';
import { toObjectId } from '../../common/utils/mongoose.utils';

@Injectable()
export class UserRepo extends AbstractRepo<User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProgress.name)
    private readonly userProgressModel: Model<UserProgress>,
    @InjectModel(Day.name) private readonly dayModel: Model<Day>,
    @InjectModel(Task.name) private readonly taskModel: Model<any>,
    @InjectModel(UserTask.name) private readonly userTaskModel: Model<any>,
    @InjectModel(Level.name) private readonly levelModel: Model<Level>,
  ) {
    super(userModel);
  }

  async userProgress(
    userId: string,
    levelName: Level_Name,
  ): Promise<number | null> {
    try {
      // Convert userId to ObjectId
      const userIdObjectId = toObjectId(userId);

      const completedProgress = await this.userProgressModel
        .find({
          userId: userIdObjectId,
          completed: true,
        })
        .populate({
          path: 'dayId',
          match: { levelName }, // filter by levelName
          select: 'dayNumber levelName',
        })
        .select('dayId') // only get day info
        .lean();

      const completedDayNumbers = completedProgress
        .filter((p) => p.dayId) // make sure populate didn't miss
        .map((p) => p.dayId.dayNumber);

      // Return the maximum day number or null if no days are completed
      return completedDayNumbers.length > 0
        ? Math.max(...completedDayNumbers)
        : 0;
    } catch (error) {
      if (error instanceof ForbiddenException) throw new Error(error.message);

      this.logger.error(
        `Error getting completed days: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get completed days');
    }
  }

  async getDayStatus(
    userId: string,
    levelName: Level_Name,
    dayNumber: number,
  ) {
    try {
      const day = await this.dayModel.findOne({ levelName, dayNumber });
      if (!day) return null;

      const progress = await this.userProgressModel
        .findOne({
          userId: toObjectId(userId),
          dayId: day._id,
        })
        .lean();

      return progress
        ? {
          completed: progress.completed,
          dailyTestResult: progress.dailyTestResult,
        }
        : null;
    } catch (error) {
      this.logger.error(
        `Error getting day status: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get day status');
    }
  }

  async getTotalDaysInLevel(levelName: Level_Name): Promise<number> {
    try {
      const totalDays = await this.dayModel.countDocuments({ levelName });
      return totalDays;
    } catch (error) {
      this.logger.error(
        `Error getting total days in level: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get total days in level',
      );
    }
  }

  async markDayAsCompleted(
    userId: string,
    levelName: Level_Name,
    dayNumber: number,
    dailyTestResult?: any,
  ) {
    const day = await this.getOrCreateDay(levelName, dayNumber);

    try {
      // Convert userId to ObjectId
      const userIdObjectId = toObjectId(userId);

      await this.userProgressModel.updateOne(
        {
          userId: userIdObjectId,
          dayId: day._id,
        },
        {
          $set: {
            completed: true,
            completedAt: new Date(),
            dailyTestResult,
          },
        },
        { upsert: true },
      );

      return { message: 'Day marked as completed successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      this.logger.error(
        `Error marking day as completed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to mark day as completed');
    }
  }

  async markTaskAsCompleted(
    userId: string,
    levelName: Level_Name,
    dayNumber: number,
    taskName: string,
    submission?: any,
    score?: number,
    feedback?: string,
  ) {
    try {
      // Convert userId to ObjectId
      const userIdObjectId = toObjectId(userId);

      const day = await this.getOrCreateDay(levelName, dayNumber);

      // Step 3: Get or create the Task (upsert style)
      const task = await this.taskModel.findOneAndUpdate(
        { dayId: day._id, name: taskName },
        {
          $setOnInsert: {
            description: 'Task Default Description',
          },
        },
        {
          new: true,
          upsert: true,
        },
      );

      // Step 4: Update or create UserTask
      await this.userTaskModel.updateOne(
        {
          userId: userIdObjectId,
          taskId: task._id,
        },
        {
          $set: {
            completed: true,
            completedAt: new Date(),
            submission,
            score,
            feedback,
          },
        },
        { upsert: true },
      );

      return { message: 'Task marked as completed successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      this.logger.error(
        `Error marking task as completed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to mark task as completed',
      );
    }
  }

  async getCompletedTasksInDay(
    userId: string,
    levelName: Level_Name,
    dayNumber: number,
  ) {
    try {
      // Convert userId to ObjectId
      const userIdObjectId = toObjectId(userId);

      const day = await this.dayModel.findOne({ levelName, dayNumber });
      if (!day) {
        return [];
      }

      const completedTasks = await this.userTaskModel
        .find({
          userId: userIdObjectId,
          completed: true,
        })
        .populate({
          path: 'taskId',
          match: { dayId: day._id },
          select: 'name description',
        })
        .select('taskId')
        .lean();

      return completedTasks
        .filter((t) => t.taskId) // make sure populate didn't miss
        .map((t) => t.taskId.name);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      this.logger.error(
        `Error getting completed tasks: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get completed tasks');
    }
  }

  private async getOrCreateDay(
    levelName: Level_Name,
    dayNumber: number,
  ): Promise<Day> {
    // Find or create the Day
    const day = await this.dayModel.findOneAndUpdate(
      { levelName, dayNumber },
      {
        $setOnInsert: {
          levelName,
          dayNumber,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return day;
  }

  async countDocuments(filter: Record<string, any> = {}): Promise<number> {
    try {
      // Convert filter _id to ObjectId if it's a string
      if (filter._id && typeof filter._id === 'string') {
        filter._id = toObjectId(filter._id);
      }

      return await this.userModel.countDocuments(filter).exec();
    } catch (error) {
      this.logger.error(
        `Error counting documents: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to count documents');
    }
  }

  async setSeenChatWelcome(userId: string) {
    try {
      await this.userModel.updateOne(
        { _id: toObjectId(userId) },
        { hasSeenChatWelcome: true },
        { upsert: false }, // Should only update existing user
      );
    } catch (error) {
      this.logger.error(
        `Error setting chat welcome seen: ${error.message}`,
        error.stack,
      );
    }
  }

  async deleteProgress(
    userId: string | Types.ObjectId,
    levelName: string,
    session?: ClientSession,
  ) {
    const userIdObjectId = toObjectId(userId.toString());
    // 1. Find the Days associated with this level to get their IDs
    const days = await this.dayModel.find({ levelName }).select('_id');
    const dayIds = days.map((d) => d._id);

    return await this.userProgressModel.deleteMany(
      { userId: userIdObjectId, dayId: { $in: dayIds } },
      { session: session || null },
    );
  }

  /**
   * Aggregates all student data for the report dashboard.
   * Returns completed days per level, task stats (by type), and daily test results.
   */
  async getReportData(userId: string) {
    const userIdObjectId = toObjectId(userId);

    // 1. Get ALL completed progress (days) with populated day info
    const allProgress = await this.userProgressModel
      .find({ userId: userIdObjectId, completed: true })
      .populate({ path: 'dayId', select: 'dayNumber levelName' })
      .select('dayId dailyTestResult completedAt')
      .lean();

    // 2. Group by level
    const levelProgress: Record<string, { completedDays: number; testResults: any[]; firstCompletedAt?: Date; lastCompletedAt?: Date }> = {};
    for (const p of allProgress) {
      if (!p.dayId) continue;
      const lvl = (p.dayId as any).levelName;
      if (!levelProgress[lvl]) {
        levelProgress[lvl] = { completedDays: 0, testResults: [], firstCompletedAt: undefined, lastCompletedAt: undefined };
      }
      levelProgress[lvl].completedDays++;
      if (p.dailyTestResult) {
        levelProgress[lvl].testResults.push(p.dailyTestResult);
      }
      const dt = p.completedAt ? new Date(p.completedAt) : undefined;
      if (dt) {
        if (!levelProgress[lvl].firstCompletedAt || dt < levelProgress[lvl].firstCompletedAt) {
          levelProgress[lvl].firstCompletedAt = dt;
        }
        if (!levelProgress[lvl].lastCompletedAt || dt > levelProgress[lvl].lastCompletedAt) {
          levelProgress[lvl].lastCompletedAt = dt;
        }
      }
    }

    // 3. Get ALL completed tasks with scores and task names
    const allTasks = await this.userTaskModel
      .find({ userId: userIdObjectId, completed: true })
      .populate({ path: 'taskId', select: 'name dayId' })
      .select('taskId score completedAt submission')
      .lean();

    // 4. Count tasks by type (READ, WRITE, SPEAK, LISTEN, etc.)
    const tasksByType: Record<string, number> = {};
    let totalScore = 0;
    let scoreCount = 0;
    for (const t of allTasks) {
      if (!t.taskId) continue;
      const taskName: string = (t.taskId as any).name || '';
      // Detect task type from name (tasks use lesson type names)
      const upperName = taskName.toUpperCase();
      if (upperName.includes('READ') || upperName.includes('READING')) {
        tasksByType['READ'] = (tasksByType['READ'] || 0) + 1;
      } else if (upperName.includes('WRITE') || upperName.includes('WRITING')) {
        tasksByType['WRITE'] = (tasksByType['WRITE'] || 0) + 1;
      } else if (upperName.includes('SPEAK') || upperName.includes('SPEAKING')) {
        tasksByType['SPEAK'] = (tasksByType['SPEAK'] || 0) + 1;
      } else if (upperName.includes('LISTEN') || upperName.includes('LISTENING')) {
        tasksByType['LISTEN'] = (tasksByType['LISTEN'] || 0) + 1;
      } else if (upperName.includes('GRAMMAR')) {
        tasksByType['GRAMMAR'] = (tasksByType['GRAMMAR'] || 0) + 1;
      } else if (upperName.includes('IDIOM')) {
        tasksByType['IDIOMS'] = (tasksByType['IDIOMS'] || 0) + 1;
      } else if (upperName.includes('PHRASAL')) {
        tasksByType['PHRASAL_VERBS'] = (tasksByType['PHRASAL_VERBS'] || 0) + 1;
      } else {
        // Count as general speaking tasks (sentence recordings)
        tasksByType['SPEAK'] = (tasksByType['SPEAK'] || 0) + 1;
      }
      if (typeof t.score === 'number') {
        totalScore += t.score;
        scoreCount++;
      }
    }

    // 5. Calculate streak from completion dates
    const allDates = allProgress
      .filter(p => p.completedAt)
      .map(p => {
        const d = new Date(p.completedAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      });
    const uniqueDates = [...new Set(allDates)].sort().reverse();

    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    for (const dateStr of uniqueDates) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (dateStr === checkStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (currentStreak === 0) {
        // Allow yesterday as the check starting point
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (dateStr === yesterdayStr) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return {
      levelProgress,
      totalCompletedTasks: allTasks.length,
      tasksByType,
      averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      totalActiveDays: uniqueDates.length,
      currentStreak,
    };
  }

  async deleteTasks(
    userId: string | Types.ObjectId,
    levelName: string,
    session?: ClientSession,
  ) {
    const userIdObjectId = toObjectId(userId.toString());
    // 1. Find Days of Level
    const days = await this.dayModel.find({ levelName }).select('_id');
    const dayIds = days.map((d) => d._id);

    // 2. Find Tasks of these Days
    const tasks = await this.taskModel.find({ dayId: { $in: dayIds } }).select('_id');
    const taskIds = tasks.map((t) => t._id);

    // 3. Delete UserTasks
    return await this.userTaskModel.deleteMany(
      { userId: userIdObjectId, taskId: { $in: taskIds } },
      { session: session || null },
    );
  }
}
