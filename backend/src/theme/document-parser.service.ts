import { Injectable, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

@Injectable()
export class DocumentParserService {
    async parseFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const mimeType = file.mimetype;

        if (mimeType === 'application/pdf') {
            return this.parsePdf(file.buffer);
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            return this.parseWord(file.buffer);
        } else {
            throw new BadRequestException('Unsupported file type. Please upload PDF or Word documents.');
        }
    }

    private async parsePdf(buffer: Buffer): Promise<string> {
        try {
            const data = await pdf(buffer);
            return this.cleanText(data.text);
        } catch (error) {
            console.error('PDF Parse Error:', error);
            throw new BadRequestException('Failed to parse PDF file');
        }
    }

    private async parseWord(buffer: Buffer): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ buffer });
            return this.cleanText(result.value);
        } catch (error) {
            console.error('Word Parse Error:', error);
            throw new BadRequestException('Failed to parse Word file');
        }
    }

    private cleanText(text: string): string {
        // Remove excessive whitespace, null bytes, and control characters
        return text
            .replace(/\u0000/g, '') // Remove null bytes
            .replace(/\r\n/g, '\n') // Normalize newlines
            .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
            .trim();
    }
}
