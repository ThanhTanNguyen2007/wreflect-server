-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('Planned', 'Doing', 'Complete', 'Reopened');

-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('DEFAULT', 'PHASE');

-- CreateEnum
CREATE TYPE "PhaseType" AS ENUM ('REFLECT', 'GROUP', 'VOTES', 'DISCUSS');

-- CreateEnum
CREATE TYPE "StatusHealthCheck" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "OpinionStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'REJECTED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('DOING', 'DONE');

-- CreateEnum
CREATE TYPE "UserConnectionStatus" AS ENUM ('Connect', 'Sending');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('UNSPECIFIED', 'MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "isSubmit" BOOLEAN NOT NULL,
    "assessmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "concerningMemberId" TEXT NOT NULL,
    "evaluationId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerOnCriteria" (
    "id" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "resultId" TEXT,
    "point" INTEGER,
    "comment" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "picture" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "status" "TeamStatus" NOT NULL DEFAULT E'DOING',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheckTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "disableDownVote" BOOLEAN NOT NULL DEFAULT false,
    "disableUpVote" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "votesLimit" INTEGER NOT NULL DEFAULT 25,
    "meetingNote" TEXT NOT NULL DEFAULT E'My meeting note...',
    "currentColumnId" TEXT,
    "title" TEXT NOT NULL,
    "timerInProgress" BOOLEAN NOT NULL DEFAULT false,
    "type" "BoardType" NOT NULL DEFAULT E'PHASE',
    "currentPhase" "PhaseType" NOT NULL DEFAULT E'REFLECT',
    "endTime" TIMESTAMP(3),
    "boardTemplateId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberOnHealthCheckOnQuestion" (
    "id" TEXT NOT NULL,
    "healthCheckId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT E'white',
    "title" TEXT NOT NULL,
    "columnTemplateId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opinion" (
    "id" TEXT NOT NULL,
    "columnId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "upVote" TEXT[],
    "downVote" TEXT[],
    "updatedBy" TEXT NOT NULL,
    "isAction" BOOLEAN NOT NULL DEFAULT false,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "responsible" TEXT NOT NULL DEFAULT E'not-assigned',
    "mergedAuthors" TEXT[],
    "color" TEXT NOT NULL DEFAULT E'pink',
    "position" INTEGER NOT NULL,
    "status" "OpinionStatus" NOT NULL DEFAULT E'NEW',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remark" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "opinionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "isSuperOwner" BOOLEAN NOT NULL DEFAULT false,
    "isPendingInvitation" BOOLEAN NOT NULL DEFAULT false,
    "isGuess" BOOLEAN NOT NULL DEFAULT false,
    "meetingNote" TEXT,
    "invitedBy" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isSeenNotification" BOOLEAN NOT NULL DEFAULT false,
    "isRegistered" BOOLEAN NOT NULL DEFAULT true,
    "userStatus" "UserStatus" NOT NULL DEFAULT E'OFFLINE',
    "nickname" VARCHAR(150) NOT NULL,
    "picture" VARCHAR(500) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT E'UNSPECIFIED',
    "workplace" VARCHAR(300),
    "address" VARCHAR(300),
    "school" VARCHAR(300),
    "introduction" VARCHAR(500),
    "talents" VARCHAR(500),
    "interests" VARCHAR(500),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanningUser" (
    "id" TEXT NOT NULL,
    "isBannedForever" BOOLEAN NOT NULL DEFAULT false,
    "startBanned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endBanned" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnCriteria" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "linkRedirect" TEXT,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemiderNotification" (
    "id" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "sendTo" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session.userId_token_unique" ON "Session"("userId", "token");

-- CreateIndex
CREATE INDEX "Session.expiresAt_index" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation.assessmentId_assessorId_unique" ON "Evaluation"("assessmentId", "assessorId");

-- CreateIndex
CREATE UNIQUE INDEX "Criteria.name_unique" ON "Criteria"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheckTemplate.title_unique" ON "HealthCheckTemplate"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateQuestion.title_templateId_unique" ON "TemplateQuestion"("title", "templateId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheck.boardId_unique" ON "HealthCheck"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheck.teamId_boardId_unique" ON "HealthCheck"("teamId", "boardId");

-- CreateIndex
CREATE UNIQUE INDEX "Member.userId_teamId_unique" ON "Member"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE INDEX "User.email_index" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BanningUser.userId_unique" ON "BanningUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOnCriteria.userId_criteriaId_unique" ON "UserOnCriteria"("userId", "criteriaId");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("creatorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD FOREIGN KEY ("assessorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY ("concerningMemberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOnCriteria" ADD FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckTemplate" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateQuestion" ADD FOREIGN KEY ("templateId") REFERENCES "HealthCheckTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("questionId") REFERENCES "TemplateQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remark" ADD FOREIGN KEY ("opinionId") REFERENCES "Opinion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remark" ADD FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanningUser" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
