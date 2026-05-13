CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'IMPORT', 'EXPORT', 'PASSWORD_RESET', 'INVITE_SENT');--> statement-breakpoint
CREATE TYPE "public"."audit_entity" AS ENUM('pregnant_women', 'users', 'imports', 'auth', 'settings');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'partial');--> statement-breakpoint
CREATE TYPE "public"."import_type" AS ENUM('csv', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."blood_pressure_status" AS ENUM('normal', 'elevated', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."exam_result" AS ENUM('pending', 'negative', 'positive', 'not_performed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'manager', 'nurse', 'doctor', 'acs');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'pending_first_access');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"esf_id" uuid,
	"action" "audit_action" NOT NULL,
	"entity" "audit_entity" NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb,
	"ip_address" text NOT NULL,
	"user_agent" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "esfs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "esfs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"type" "import_type" NOT NULL,
	"file_name" text NOT NULL,
	"total_records" integer DEFAULT 0 NOT NULL,
	"processed_records" integer DEFAULT 0 NOT NULL,
	"failed_records" integer DEFAULT 0 NOT NULL,
	"status" "import_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invite_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"esf_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invite_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pregnant_women" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"name" text NOT NULL,
	"cpf" text NOT NULL,
	"birth_date" timestamp with time zone NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"microarea" text NOT NULL,
	"weight" numeric(5, 2),
	"height" numeric(5, 2),
	"blood_pressure" text,
	"blood_pressure_status" "blood_pressure_status",
	"last_measurement_date" timestamp with time zone,
	"days_since_doctor" integer,
	"days_since_nursing" integer,
	"days_since_dentist" integer,
	"days_since_home_visit" integer,
	"prenatal_consultations" integer DEFAULT 0 NOT NULL,
	"consultations_up_to_12_weeks" integer DEFAULT 0 NOT NULL,
	"blood_pressure_measurements" integer DEFAULT 0 NOT NULL,
	"weight_height_measurements" integer DEFAULT 0 NOT NULL,
	"home_visits" integer DEFAULT 0 NOT NULL,
	"dental_appointments" integer DEFAULT 0 NOT NULL,
	"dtpa_registered" boolean DEFAULT false NOT NULL,
	"hiv_exam_1st_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"syphilis_exam_1st_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"hepatitis_b_exam_1st_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"hepatitis_c_exam_1st_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"hiv_exam_3rd_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"syphilis_exam_3rd_trimester" "exam_result" DEFAULT 'pending' NOT NULL,
	"observations" text,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'acs' NOT NULL,
	"status" "user_status" DEFAULT 'pending_first_access' NOT NULL,
	"team" text,
	"avatar_url" text,
	"esf_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "imports" ADD CONSTRAINT "imports_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "imports" ADD CONSTRAINT "imports_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pregnant_women" ADD CONSTRAINT "pregnant_women_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pregnant_women" ADD CONSTRAINT "pregnant_women_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
