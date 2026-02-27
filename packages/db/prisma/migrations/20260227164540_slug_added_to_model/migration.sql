/*
  Warnings:

  - You are about to drop the column `slug` on the `Company` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "slug" TEXT NOT NULL;
