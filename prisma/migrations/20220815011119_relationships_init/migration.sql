/*
  Warnings:

  - You are about to drop the `Allergies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AllergiesToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_AllergiesToUsers` DROP FOREIGN KEY `_AllergiesToUsers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AllergiesToUsers` DROP FOREIGN KEY `_AllergiesToUsers_B_fkey`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `allergies` JSON NULL;

-- DropTable
DROP TABLE `Allergies`;

-- DropTable
DROP TABLE `_AllergiesToUsers`;
