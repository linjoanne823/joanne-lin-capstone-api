/*
  Warnings:

  - The primary key for the `Restaurants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_RestaurantsToUsers` DROP FOREIGN KEY `_RestaurantsToUsers_A_fkey`;

-- AlterTable
ALTER TABLE `Restaurants` DROP PRIMARY KEY,
    MODIFY `restaurant_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`restaurant_id`);

-- AlterTable
ALTER TABLE `_RestaurantsToUsers` MODIFY `A` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `_RestaurantsToUsers` ADD CONSTRAINT `_RestaurantsToUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Restaurants`(`restaurant_id`) ON DELETE CASCADE ON UPDATE CASCADE;
