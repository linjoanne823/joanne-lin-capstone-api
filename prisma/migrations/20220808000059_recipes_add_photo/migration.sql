-- AlterTable
ALTER TABLE `Recipes` ADD COLUMN `photo` VARCHAR(256) NULL;

-- AlterTable
ALTER TABLE `Restaurants` MODIFY `photos` VARCHAR(256) NULL;
