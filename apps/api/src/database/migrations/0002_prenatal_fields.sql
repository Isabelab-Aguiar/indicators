CREATE TYPE "gestational_risk" AS ENUM('habitual', 'alto_risco');

ALTER TABLE "pregnant_women"
  ADD COLUMN "gestational_risk" "gestational_risk",
  ADD COLUMN "lmp" timestamp with time zone,
  ADD COLUMN "gestational_age_weeks" integer,
  ADD COLUMN "gestational_age_days" integer,
  ADD COLUMN "expected_delivery_date" timestamp with time zone,
  ADD COLUMN "gestational_age_eco_weeks" integer,
  ADD COLUMN "gestational_age_eco_days" integer,
  ADD COLUMN "expected_delivery_date_eco" timestamp with time zone,
  ADD COLUMN "last_prenatal_consultation" timestamp with time zone;

ALTER TABLE "pregnant_women"
  ALTER COLUMN "hiv_exam_1st_trimester" SET DEFAULT 'not_performed',
  ALTER COLUMN "syphilis_exam_1st_trimester" SET DEFAULT 'not_performed',
  ALTER COLUMN "hepatitis_b_exam_1st_trimester" SET DEFAULT 'not_performed',
  ALTER COLUMN "hepatitis_c_exam_1st_trimester" SET DEFAULT 'not_performed',
  ALTER COLUMN "hiv_exam_3rd_trimester" SET DEFAULT 'not_performed',
  ALTER COLUMN "syphilis_exam_3rd_trimester" SET DEFAULT 'not_performed';
