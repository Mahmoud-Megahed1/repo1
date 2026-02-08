import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemeService } from './theme.service';
import { DocumentParserService } from './document-parser.service';
import { Public } from '../admin-auth/decorators/public.decorator';

@ApiTags('Themes')
@Controller('themes')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
    private readonly documentParserService: DocumentParserService
  ) { }

  @Post(':id/upload-knowledge')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadKnowledge(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const text = await this.documentParserService.parseFile(file);
      return await this.themeService.appendKnowledgeContext(id, text);
    } catch (error) {
      console.error('Error uploading knowledge:', error);
      throw error;
    }
  }

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
