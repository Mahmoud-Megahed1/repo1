import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme, ThemeDocument } from './theme.schema';

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
  ) { }

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const createdTheme = new this.themeModel(createThemeDto);
    const saved = await createdTheme.save();
    return saved.toObject();
  }

  async findAll(): Promise<Theme[]> {
    return this.themeModel.find().lean().exec();
  }

  async findOne(id: string): Promise<Theme> {
    return this.themeModel.findById(id).lean().exec();
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    return this.themeModel
      .findByIdAndUpdate(id, updateThemeDto, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string): Promise<Theme> {
    return this.themeModel.findByIdAndDelete(id).lean().exec();
  }

  async findCurrentTheme(): Promise<Theme | null> {
    const now = new Date();
    return this.themeModel
      .findOne({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .lean()
      .exec();
  }
}
