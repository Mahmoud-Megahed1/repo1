import { Controller, Get, Logger } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SkipVerifiedGuard } from '../user-auth/guards/skip-verified.guard';

@SkipVerifiedGuard()
@Controller('public-dashboard')
export class PublicDashboardController {
  private readonly logger = new Logger(PublicDashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get public live dashboard statistics
   * Access: Public (No auth required)
   */
  @Get('stats')
  async getPublicStats() {
    this.logger.log('Public dashboard stats requested');
    return await this.dashboardService.getPublicLiveStats();
  }
}
