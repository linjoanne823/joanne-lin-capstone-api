-- CreateTable
CREATE TABLE `Allergies` (
    `allergy_id` INTEGER NOT NULL AUTO_INCREMENT,
    `allergy_name` VARCHAR(128) NULL,

    UNIQUE INDEX `Allergies_allergy_name_key`(`allergy_name`),
    PRIMARY KEY (`allergy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipes` (
    `recipe_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ready_in_minutes` VARCHAR(128) NULL,
    `servings` VARCHAR(128) NULL,
    `ingredients` VARCHAR(2048) NULL,
    `instructions` VARCHAR(2048) NULL,
    `name` VARCHAR(128) NULL,
    `photo` VARCHAR(256) NULL,

    PRIMARY KEY (`recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurants` (
    `restaurant_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(128) NULL,
    `categories` VARCHAR(128) NULL,
    `price` VARCHAR(8) NULL,
    `rating` VARCHAR(8) NULL,
    `location` VARCHAR(128) NULL,
    `photos` VARCHAR(256) NULL,
    `reviews` JSON NULL,

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(128) NULL,
    `last_name` VARCHAR(128) NULL,
    `email` VARCHAR(128) NULL,
    `password` VARCHAR(128) NULL,
    `city` VARCHAR(128) NULL,
    `register_date` DATETIME(0) NULL,
    `dietary_restrictions` VARCHAR(128) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AllergiesToUsers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AllergiesToUsers_AB_unique`(`A`, `B`),
    INDEX `_AllergiesToUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecipesToUsers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecipesToUsers_AB_unique`(`A`, `B`),
    INDEX `_RecipesToUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RestaurantsToUsers` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RestaurantsToUsers_AB_unique`(`A`, `B`),
    INDEX `_RestaurantsToUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AllergiesToUsers` ADD CONSTRAINT `_AllergiesToUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Allergies`(`allergy_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AllergiesToUsers` ADD CONSTRAINT `_AllergiesToUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipesToUsers` ADD CONSTRAINT `_RecipesToUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Recipes`(`recipe_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipesToUsers` ADD CONSTRAINT `_RecipesToUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RestaurantsToUsers` ADD CONSTRAINT `_RestaurantsToUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Restaurants`(`restaurant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RestaurantsToUsers` ADD CONSTRAINT `_RestaurantsToUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
