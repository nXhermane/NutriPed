CREATE TABLE `data_field_references` (
	`field_id` text PRIMARY KEY NOT NULL,
	`field_code` text(50) NOT NULL,
	`field_label` text(250) NOT NULL,
	`field_question` text(500) NOT NULL,
	`field_category` text NOT NULL,
	`field_type` text NOT NULL,
	`field_range` text,
	`field_enum` text,
	`field_units` text,
	`field_value` text,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `next_clinical_sign_references` (
	`clinical_sign_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`clinical_sign_reference_name` text(255) NOT NULL,
	`clinical_sign_reference_code` text(10) NOT NULL,
	`clinical_sign_reference_description` text NOT NULL,
	`clinical_sign_reference_evaluation_rule` text NOT NULL,
	`clinical_sign_reference_data` text NOT NULL
);
