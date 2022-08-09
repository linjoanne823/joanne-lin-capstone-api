/*
  Warnings:

  - You are about to drop the column `business_hours` on the `Restaurants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Restaurants` DROP COLUMN `business_hours`,
    ADD COLUMN `reviewRating` VARCHAR(128) NULL,
    ADD COLUMN `reviewText` VARCHAR(256) NULL,
    ADD COLUMN `reviewUser` VARCHAR(128) NULL;
