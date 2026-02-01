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
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themeService.create(createThemeDto);
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
  findCurrent() {
    return this.themeService.findCurrentTheme();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.themeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    return this.themeService.update(id, updateThemeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.themeService.remove(id);
  }
}
