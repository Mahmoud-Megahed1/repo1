import { LEVELS_ID } from '@/constants';
import { z } from 'zod';

export const formSchema = z.object({
    useCasesAr: z.array(z.string().trim().min(5)),
    useCasesEn: z.array(z.string().trim().min(5)),
    examples: z.array(
        z.object({
            pictureSrc: z.any().refine((val) => !!val, {
                message: 'Picture is required',
            }),
            soundSrc: z.any().refine((val) => !!val, {
                message: 'Sound file is required',
            }),
            exampleAr: z.string().min(4),
            exampleEn: z.string().min(4),
            sentence: z.string().min(4),
        }),
    ),
    definitionAr: z.string().min(5),
    definitionEn: z.string().min(5),
    levelId: z.enum(LEVELS_ID),
    day: z.string(),
});
