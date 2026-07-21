import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRoles } from '../admin-auth/decorators';
import { AdminRole } from '../common/shared';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return await this.settingsService.getGlobalSettings();
  }

  @Patch('tests-availability')
  async updateTestsAvailability(@Body() body: { testsAvailability: Record<string, boolean> }) {
    const current = await this.settingsService.getGlobalSettings();
    const updatedMap = {
      ...(current.testsAvailability || { ques: true, test: true, test1: true }),
      ...body.testsAvailability,
    };
    return await this.settingsService.updateSettings({ testsAvailability: updatedMap });
  }

  @UseGuards(AdminJwtGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  @Patch()
  async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
    return await this.settingsService.updateSettings(updateSettingsDto);
  }
}
