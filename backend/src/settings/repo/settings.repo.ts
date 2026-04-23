import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { Settings } from '../models/settings.schema';

@Injectable()
export class SettingsRepo extends AbstractRepo<Settings> {
  constructor(
    @InjectModel(Settings.name) private readonly settingsModel: Model<Settings>,
  ) {
    super(settingsModel);
  }

  async getGlobalSettings(): Promise<Settings> {
    let settings = await this.settingsModel.findOne({}).lean<Settings>(true);
    if (!settings) {
      settings = await this.create({ repurchaseDiscounts: [] });
    }
    return settings;
  }
}
