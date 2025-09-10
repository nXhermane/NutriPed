CREATE TABLE `next_appetite_test_references` (
	`appetite_test_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`code` text(255) NOT NULL,
	`product_type` text,
	`appetite_test_table` text NOT NULL
);
