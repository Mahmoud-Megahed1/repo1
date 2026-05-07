ALTER TABLE `testResults` MODIFY COLUMN `vocabularyScore` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `vocabularyScore` int NOT NULL;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `grammarScore` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `grammarScore` int NOT NULL;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `readingScore` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `readingScore` int NOT NULL;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `listeningScore` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `listeningScore` int NOT NULL;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `writingScore` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `testResults` MODIFY COLUMN `writingScore` int NOT NULL;