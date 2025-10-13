CREATE TYPE "public"."user_role" AS ENUM('student', 'manager');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'student' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createAt" timestamp with time zone DEFAULT now() NOT NULL;