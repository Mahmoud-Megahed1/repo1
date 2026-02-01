import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemeService } from './theme.service';
import { Public } from '../admin-auth/decorators/public.decorator';

@ApiTags('Themes')
@Controller('themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) { }

  @Post()
  async create(@Body() createThemeDto: CreateThemeDto) {
    try {
      return await this.themeService.create(createThemeDto);
    } catch (error) {
      console.error('Error in ThemeController.create:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.themeService.findAll();
    } catch (error) {
      console.error('Error in ThemeController.findAll:', error);
      throw error;
    }
  }

  @Public()
  @Get('current')
  async findCurrent() {
    try {
      return await this.themeService.findCurrentTheme();
    } catch (error) {
      console.error('Error in ThemeController.findCurrent:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.themeService.findOne(id);
    } catch (error) {
      console.error(`Error in ThemeController.findOne(${id}):`, error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    try {
      return await this.themeService.update(id, updateThemeDto);
    } catch (error) {
      console.error(`Error in ThemeController.update(${id}):`, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.themeService.remove(id);
    } catch (error) {
      console.error(`Error in ThemeController.remove(${id}):`, error);
      throw error;
    }
  }
}
