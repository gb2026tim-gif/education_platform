-- CreateTable
CREATE TABLE "jurors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT,
    "password_hash" TEXT,
    "password_changed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jurors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "works" (
    "id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "github_url" TEXT,
    "video_url" TEXT,
    "live_demo_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "juror_id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "display_number" INTEGER NOT NULL,
    "evaluated" BOOLEAN NOT NULL DEFAULT false,
    "is_draft" BOOLEAN NOT NULL DEFAULT false,
    "evaluated_at" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "backend_code" INTEGER NOT NULL DEFAULT 50,
    "database_structure" INTEGER NOT NULL DEFAULT 50,
    "frontend_code" INTEGER NOT NULL DEFAULT 50,
    "backend_functionality" INTEGER NOT NULL DEFAULT 50,
    "database_functionality" INTEGER NOT NULL DEFAULT 50,
    "frontend_functionality" INTEGER NOT NULL DEFAULT 50,
    "comment" TEXT,
    "requirements_rest" BOOLEAN NOT NULL DEFAULT false,
    "requirements_db" BOOLEAN NOT NULL DEFAULT false,
    "requirements_auth" BOOLEAN NOT NULL DEFAULT false,
    "requirements_frontend" BOOLEAN NOT NULL DEFAULT false,
    "requirements_deploy" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jury_tokens" (
    "id" TEXT NOT NULL,
    "juror_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jury_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jurors_email_key" ON "jurors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_juror_id_work_id_key" ON "assignments"("juror_id", "work_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_assignment_id_key" ON "evaluations"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "jury_tokens_token_key" ON "jury_tokens"("token");

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_juror_id_fkey" FOREIGN KEY ("juror_id") REFERENCES "jurors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jury_tokens" ADD CONSTRAINT "jury_tokens_juror_id_fkey" FOREIGN KEY ("juror_id") REFERENCES "jurors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
