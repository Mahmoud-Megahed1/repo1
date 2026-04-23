import { Injectable, Logger } from '@nestjs/common';
import { SettingsRepo } from './repo/settings.repo';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './models/settings.schema';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly settingsRepo: SettingsRepo) {}

  async getGlobalSettings(): Promise<Settings> {
    return await this.settingsRepo.getGlobalSettings();
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.getGlobalSettings();
    const updatedSettings = await this.settingsRepo.findOneAndUpdate(
      { _id: settings._id },
      updateSettingsDto
    );
    this.logger.log('Global settings updated');
    return updatedSettings as Settings;
  }
}
