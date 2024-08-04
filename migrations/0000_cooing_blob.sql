CREATE TABLE `course` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`course` text NOT NULL,
	`college` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `day` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activity` text NOT NULL,
	`day` text NOT NULL,
	`startTime` text NOT NULL,
	`name` text NOT NULL,
	`room` text NOT NULL,
	`type` text NOT NULL,
	`teacher` text NOT NULL,
	`length` text NOT NULL,
	`endTime` text NOT NULL,
	`break` integer NOT NULL,
	`breakLength` integer NOT NULL,
	`timetableId` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`timetableId`) REFERENCES `timetable`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timetable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`courseCode` text NOT NULL,
	`semester` integer NOT NULL,
	`college` text NOT NULL,
	`empty` integer NOT NULL,
	`url` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
