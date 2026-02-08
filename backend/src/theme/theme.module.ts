import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemeController } from './theme.controller';
import { Theme, ThemeSchema } from './theme.schema';
import { ThemeService } from './theme.service';
import { DocumentParserService } from './document-parser.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Theme.name, schema: ThemeSchema }]),
  ],
  controllers: [ThemeController],
  providers: [ThemeService, DocumentParserService],
  exports: [ThemeService],
})
export class ThemeModule { }
