CREATE TYPE "public"."c1_classificacao" AS ENUM('otimo', 'bom', 'suficiente', 'regular');--> statement-breakpoint
CREATE TYPE "public"."c1_importacao_status" AS ENUM('pendente', 'processando', 'concluido', 'erro');--> statement-breakpoint
CREATE TYPE "public"."gestational_risk" AS ENUM('habitual', 'alto_risco');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c1_analytics_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"periodo" text NOT NULL,
	"snapshot_json" jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c1_execucoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"importacao_id" uuid NOT NULL,
	"esf_id" uuid NOT NULL,
	"periodo" text NOT NULL,
	"programada" integer NOT NULL,
	"espontanea" integer NOT NULL,
	"total" integer NOT NULL,
	"percentual" numeric(5, 2) NOT NULL,
	"classificacao" "c1_classificacao" NOT NULL,
	"alerta" text,
	"breakdown_json" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c1_importacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"periodo" text NOT NULL,
	"arquivo_nome" text NOT NULL,
	"arquivo_url" text NOT NULL,
	"status" "c1_importacao_status" DEFAULT 'pendente' NOT NULL,
	"erro_detalhes" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c5_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"birth_date" date,
	"consultations_last6m" integer DEFAULT 0 NOT NULL,
	"blood_pressure_last6m" integer DEFAULT 0 NOT NULL,
	"weight_height_last12m" boolean DEFAULT false NOT NULL,
	"acs_visits_last12m" integer DEFAULT 0 NOT NULL,
	"acs_visits_interval_days" integer DEFAULT 0 NOT NULL,
	"score" numeric(5, 2),
	"classification" varchar(20),
	"periodo" varchar(10) NOT NULL,
	"microarea" varchar(50) DEFAULT '' NOT NULL,
	"acs" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_c5_nome_periodo" UNIQUE("esf_id","nome","periodo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c6_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"birth_date" date,
	"consultations_last12m" integer DEFAULT 0 NOT NULL,
	"weight_height_last12m" boolean DEFAULT false NOT NULL,
	"acs_visits_last12m" integer DEFAULT 0 NOT NULL,
	"acs_visits_interval_days" integer DEFAULT 0 NOT NULL,
	"influenza_vaccine_last12m" boolean DEFAULT false NOT NULL,
	"score" numeric(5, 2),
	"classification" varchar(20),
	"periodo" varchar(10) NOT NULL,
	"microarea" varchar(50) DEFAULT '' NOT NULL,
	"acs" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_c6_nome_periodo" UNIQUE("esf_id","nome","periodo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c7_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"birth_date" date NOT NULL,
	"cytology_last36m" boolean DEFAULT false NOT NULL,
	"hpv_vaccine_dose1" boolean DEFAULT false NOT NULL,
	"sexual_health_last12m" boolean DEFAULT false NOT NULL,
	"mammography_last24m" boolean DEFAULT false NOT NULL,
	"score" numeric(5, 2),
	"score_max" numeric(5, 2),
	"classification" varchar(20),
	"periodo" varchar(10) NOT NULL,
	"microarea" varchar(50) DEFAULT '' NOT NULL,
	"acs" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_c7_nome_periodo" UNIQUE("esf_id","nome","periodo")
);
--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "hiv_exam_1st_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "syphilis_exam_1st_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "hepatitis_b_exam_1st_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "hepatitis_c_exam_1st_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "hiv_exam_3rd_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "pregnant_women" ALTER COLUMN "syphilis_exam_3rd_trimester" SET DEFAULT 'not_performed';--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "gestational_risk" "gestational_risk";--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "lmp" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "gestational_age_weeks" integer;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "gestational_age_days" integer;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "expected_delivery_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "gestational_age_eco_weeks" integer;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "gestational_age_eco_days" integer;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "expected_delivery_date_eco" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "interruption_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pregnant_women" ADD COLUMN "last_prenatal_consultation" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "cpf" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c1_analytics_snapshots" ADD CONSTRAINT "c1_analytics_snapshots_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c1_execucoes" ADD CONSTRAINT "c1_execucoes_importacao_id_c1_importacoes_id_fk" FOREIGN KEY ("importacao_id") REFERENCES "public"."c1_importacoes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c1_execucoes" ADD CONSTRAINT "c1_execucoes_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c1_importacoes" ADD CONSTRAINT "c1_importacoes_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c5_scores" ADD CONSTRAINT "c5_scores_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c6_scores" ADD CONSTRAINT "c6_scores_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c7_scores" ADD CONSTRAINT "c7_scores_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c1_execucoes_esf_periodo" ON "c1_execucoes" USING btree ("esf_id","periodo");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c1_execucoes_classificacao" ON "c1_execucoes" USING btree ("classificacao");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c1_importacoes_esf_periodo" ON "c1_importacoes" USING btree ("esf_id","periodo");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c5_esf_periodo" ON "c5_scores" USING btree ("esf_id","periodo");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c6_esf_periodo" ON "c6_scores" USING btree ("esf_id","periodo");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c7_esf_periodo" ON "c7_scores" USING btree ("esf_id","periodo");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_cpf_unique" UNIQUE("cpf");