CREATE TABLE `emotionAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`audioUrl` text NOT NULL,
	`emotion` varchar(50) NOT NULL,
	`confidence` int NOT NULL,
	`emotionScores` text NOT NULL,
	`duration` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotionAnalyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `emotionAnalyses` ADD CONSTRAINT `emotionAnalyses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;