PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_patients` (
	`patient_id` text PRIMARY KEY NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL,
	`patient_name` text(200) NOT NULL,
	`patient_sex` text NOT NULL,
	`patient_birthday` text(50) NOT NULL,
	`patient_parents` text DEFAULT '{}',
	`patient_contact` text NOT NULL,
	`patient_address` text NOT NULL,
	`patient_registration_date` text(50) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_patients`("patient_id", "createdAt", "updatedAt", "patient_name", "patient_sex", "patient_birthday", "patient_parents", "patient_contact", "patient_address", "patient_registration_date") SELECT "patient_id", "createdAt", "updatedAt", "patient_name", "patient_sex", "patient_birthday", "patient_parents", "patient_contact", "patient_address", "patient_registration_date" FROM `patients`;--> statement-breakpoint
DROP TABLE `patients`;--> statement-breakpoint
ALTER TABLE `__new_patients` RENAME TO `patients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;