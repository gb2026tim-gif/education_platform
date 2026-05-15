/*
  Warnings:

  - You are about to drop the column `display_number` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `evaluated_at` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `is_draft` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `juror_id` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `work_id` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `cover_url` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `is_free` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `short_desc` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `courses` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `completed_at` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `enrolled_at` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `assignment_id` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `backend_code` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `backend_functionality` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `database_functionality` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `database_structure` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `frontend_code` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `frontend_functionality` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `requirements_auth` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `requirements_db` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `requirements_deploy` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `requirements_frontend` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `requirements_rest` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `jurors` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `jurors` table. All the data in the column will be lost.
  - You are about to drop the column `password_changed` on the `jurors` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `jurors` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `jury_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `jury_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `juror_id` on the `jury_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `lesson_id` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `watched_sec` on the `lesson_progress` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `is_free` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `modules` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `modules` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `github_url` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `live_demo_url` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `team_name` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `tournament_id` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `works` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jurorId,workId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,courseId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId]` on the table `evaluations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,lessonId]` on the table `lesson_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jurorId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `jurors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `jury_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurorId` to the `jury_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `lesson_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `lesson_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `courseId` to the `modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubUrl` to the `works` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `works` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentId` to the `works` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `works` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `works` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TournamentStatus" ADD VALUE 'PUBLISHED';
ALTER TYPE "TournamentStatus" ADD VALUE 'EVALUATION';

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_juror_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_work_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_author_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "jury_tokens" DROP CONSTRAINT "jury_tokens_juror_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_module_id_fkey";

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_course_id_fkey";

-- DropForeignKey
ALTER TABLE "works" DROP CONSTRAINT "works_tournament_id_fkey";

-- DropIndex
DROP INDEX "assignments_juror_id_work_id_key";

-- DropIndex
DROP INDEX "enrollments_user_id_course_id_key";

-- DropIndex
DROP INDEX "evaluations_assignment_id_key";

-- DropIndex
DROP INDEX "lesson_progress_user_id_lesson_id_key";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "display_number",
DROP COLUMN "evaluated_at",
DROP COLUMN "is_draft",
DROP COLUMN "juror_id",
DROP COLUMN "work_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayNumber" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "evaluatedAt" TIMESTAMP(3),
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jurorId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "author_id",
DROP COLUMN "cover_url",
DROP COLUMN "created_at",
DROP COLUMN "is_free",
DROP COLUMN "short_desc",
DROP COLUMN "updated_at",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "certTemplateId" TEXT,
ADD COLUMN     "coverUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shortDesc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "completed_at",
DROP COLUMN "course_id",
DROP COLUMN "enrolled_at",
DROP COLUMN "user_id",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "evaluations" DROP COLUMN "assignment_id",
DROP COLUMN "backend_code",
DROP COLUMN "backend_functionality",
DROP COLUMN "created_at",
DROP COLUMN "database_functionality",
DROP COLUMN "database_structure",
DROP COLUMN "frontend_code",
DROP COLUMN "frontend_functionality",
DROP COLUMN "requirements_auth",
DROP COLUMN "requirements_db",
DROP COLUMN "requirements_deploy",
DROP COLUMN "requirements_frontend",
DROP COLUMN "requirements_rest",
DROP COLUMN "updated_at",
ADD COLUMN     "assignmentId" TEXT NOT NULL,
ADD COLUMN     "backendCode" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "backendFunctionality" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "databaseFunctionality" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "databaseStructure" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "frontendCode" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "frontendFunctionality" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requirementsAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirementsDb" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirementsDeploy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirementsFrontend" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirementsRest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "jurors" DROP COLUMN "avatar_url",
DROP COLUMN "created_at",
DROP COLUMN "password_changed",
DROP COLUMN "password_hash",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordChanged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "jury_tokens" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "juror_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jurorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lesson_progress" DROP COLUMN "lesson_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
DROP COLUMN "watched_sec",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lessonId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "completed" SET DEFAULT true;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "is_free",
DROP COLUMN "module_id",
DROP COLUMN "video_url",
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moduleId" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "testUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '';

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "course_id",
DROP COLUMN "created_at",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "backendReq" TEXT,
ADD COLUMN     "certTemplateId" TEXT,
ADD COLUMN     "databaseReq" TEXT,
ADD COLUMN     "deployReq" TEXT,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "frontendReq" TEXT,
ADD COLUMN     "maxTeamSize" INTEGER DEFAULT 5,
ADD COLUMN     "minTeamSize" INTEGER DEFAULT 1,
ADD COLUMN     "rounds" INTEGER DEFAULT 1,
ADD COLUMN     "startAt" TIMESTAMP(3),
ADD COLUMN     "taskDeadline" TIMESTAMP(3),
ALTER COLUMN "regStart" DROP NOT NULL,
ALTER COLUMN "regEnd" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "works" DROP COLUMN "created_at",
DROP COLUMN "github_url",
DROP COLUMN "live_demo_url",
DROP COLUMN "team_name",
DROP COLUMN "tournament_id",
DROP COLUMN "video_url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "githubUrl" TEXT NOT NULL,
ADD COLUMN     "liveDemoUrl" TEXT,
ADD COLUMN     "teamName" TEXT NOT NULL,
ADD COLUMN     "tournamentId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'JURY',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_certificates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "tournamentId" TEXT,
    "courseId" TEXT,

    CONSTRAINT "user_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "nameX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nameY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fontSize" INTEGER NOT NULL DEFAULT 30,
    "fontColor" TEXT NOT NULL DEFAULT '#000000',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitations_email_key" ON "invitations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_jurorId_workId_key" ON "assignments"("jurorId", "workId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_assignmentId_key" ON "evaluations"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_userId_lessonId_key" ON "lesson_progress"("userId", "lessonId");

-- AddForeignKey
ALTER TABLE "jury_tokens" ADD CONSTRAINT "jury_tokens_jurorId_fkey" FOREIGN KEY ("jurorId") REFERENCES "jurors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_jurorId_fkey" FOREIGN KEY ("jurorId") REFERENCES "jurors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_workId_fkey" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "certificate_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
