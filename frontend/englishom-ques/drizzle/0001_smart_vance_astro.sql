CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`choiceA` text NOT NULL,
	`choiceB` text NOT NULL,
	`choiceC` text NOT NULL,
	`choiceD` text NOT NULL,
	`correctAnswer` varchar(1) NOT NULL,
	`level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
	`totalQuestions` int NOT NULL,
	`correctAnswers` int NOT NULL,
	`accuracy` int NOT NULL,
	`averageResponseTime` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `testResults` ADD CONSTRAINT `testResults_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;