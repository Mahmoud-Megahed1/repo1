CREATE TABLE `answerLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testAttemptId` int NOT NULL,
	`questionId` int NOT NULL,
	`userAnswer` varchar(512) NOT NULL,
	`isCorrect` int NOT NULL,
	`timeSpentSeconds` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `answerLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stage` int NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`questionText` text NOT NULL,
	`questionArabic` text,
	`imageUrl` varchar(512),
	`audioUrl` varchar(512),
	`correctAnswer` varchar(255) NOT NULL,
	`options` text NOT NULL,
	`explanation` text,
	`explanationArabic` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`email` varchar(320),
	`userName` varchar(255),
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testAttempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `testAttempts_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testAttemptId` int NOT NULL,
	`totalScore` int NOT NULL,
	`cefrLevel` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
	`vocabularyScore` int,
	`grammarScore` int,
	`readingScore` int,
	`listeningScore` int,
	`writingScore` int,
	`strengths` text,
	`weaknesses` text,
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
