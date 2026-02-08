import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme, ThemeDocument } from './theme.schema';

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
  ) { }

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const data = { ...createThemeDto };
    if (!data._id) {
      data._id = new Types.ObjectId().toString();
    }
    const createdTheme = new this.themeModel(data);
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

  async appendKnowledgeContext(id: string, newContext: string): Promise<Theme> {
    const theme = await this.themeModel.findById(id);
    if (!theme) {
      throw new Error('Theme not found');
    }

    const currentContext = theme.aiKnowledgeContext || '';
    const separator = '\n\n---\n\n';
    const updatedContext = currentContext ? `${currentContext}${separator}${newContext}` : newContext;

    return this.themeModel
      .findByIdAndUpdate(id, { aiKnowledgeContext: updatedContext }, { new: true })
      .lean()
      .exec();
  }
}
