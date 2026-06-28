CREATE TYPE "public"."gender_type" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('hospital', 'clinic');--> statement-breakpoint
CREATE TYPE "public"."theme_type" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TABLE "config" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme" "theme_type" NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date_of_birth" date,
	"phone" text,
	"address" text,
	"gender" "gender_type" NOT NULL,
	"FirstTimeLocation" "location_type" NOT NULL,
	"past_medical_history" text,
	"past_surgical_history" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "surgeries" (
	"surgery_id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"type" text NOT NULL,
	"date" date NOT NULL,
	"location" text NOT NULL,
	"cause" text,
	"return_date" date,
	"fees" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"visit_id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"visit_date" date DEFAULT CURRENT_DATE NOT NULL,
	"return_date" date,
	"visit_cause" text,
	"investigations" text,
	"treatment" text,
	"notes" text,
	"fees" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_surgery_id" ON "surgeries" USING btree ("surgery_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_visits_patient_id" ON "visits" USING btree ("patient_id" int4_ops);

INSERT INTO config(id,theme,password) VALUES (1,'dark','samer_1982')


UPDATE visits SET fees = 0 WHERE fees IS NULL;
UPDATE surgeries SET fees = 0 WHERE fees IS NULL;
