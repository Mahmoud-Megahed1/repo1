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
    return createdTheme.save();
  }

  async findAll(): Promise<Theme[]> {
    return this.themeModel.find().exec();
  }

  async findOne(id: string): Promise<Theme> {
    return this.themeModel.findById(id).exec();
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    return this.themeModel
      .findByIdAndUpdate(id, updateThemeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Theme> {
    return this.themeModel.findByIdAndDelete(id).exec();
  }

  async findCurrentTheme(): Promise<Theme | null> {
    const now = new Date();
    return this.themeModel
      .findOne({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }
}
