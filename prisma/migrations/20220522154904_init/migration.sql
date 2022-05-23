/*
  Warnings:

  - A unique constraint covering the columns `[title,teamId]` on the table `Template` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Template.title_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Template.title_teamId_unique" ON "Template"("title", "teamId");
