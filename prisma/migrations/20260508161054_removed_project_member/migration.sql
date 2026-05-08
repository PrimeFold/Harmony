/*
  Warnings:

  - You are about to drop the `ProjectMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectMember";
