CREATE TABLE `adminMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`scoreRange` varchar(50) NOT NULL,
	`titleAr` text,
	`titleEn` text,
	`messageAr` text,
	`messageEn` text,
	`recommendationAr` text,
	`recommendationEn` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `levelThresholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`minScore` decimal(5,2) NOT NULL,
	`maxScore` decimal(5,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `levelThresholds_id` PRIMARY KEY(`id`),
	CONSTRAINT `levelThresholds_level_unique` UNIQUE(`level`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stage` enum('visual_recognition','auditory_processing','spelling_structure','reading_sprint','vocal_challenge') NOT NULL,
	`level` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`questionText` text,
	`imageUrl` varchar(500),
	`audioUrl` varchar(500),
	`correctAnswer` text NOT NULL,
	`options` text,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testResultId` int NOT NULL,
	`questionId` int NOT NULL,
	`stage` enum('visual_recognition','auditory_processing','spelling_structure','reading_sprint','vocal_challenge') NOT NULL,
	`userAnswer` text,
	`isCorrect` enum('yes','no') NOT NULL,
	`timeSpent` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testAnswers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`studentName` varchar(255),
	`studentEmail` varchar(320),
	`overallLevel` enum('beginner','elementary','intermediate','upper_intermediate','advanced') NOT NULL,
	`totalScore` decimal(5,2) NOT NULL,
	`visualScore` decimal(5,2),
	`auditoryScore` decimal(5,2),
	`spellingScore` decimal(5,2),
	`readingScore` decimal(5,2),
	`vocalScore` decimal(5,2),
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
