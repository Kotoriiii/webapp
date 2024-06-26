-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `verifyCode` VARCHAR(191) NOT NULL,
    `isSend` BOOLEAN NOT NULL DEFAULT false,
    `isVerify` BOOLEAN NOT NULL DEFAULT false,
    `account_created` DATETIME(3) NULL,
    `account_updated` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
