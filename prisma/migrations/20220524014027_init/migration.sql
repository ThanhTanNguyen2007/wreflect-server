/*
  Warnings:

  - A unique constraint covering the columns `[title,templateId]` on the table `TemplateQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateQuestion.title_templateId_unique" ON "TemplateQuestion"("title", "templateId");
