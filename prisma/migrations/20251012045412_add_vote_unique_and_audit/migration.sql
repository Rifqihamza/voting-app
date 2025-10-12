-- CreateTable
CREATE TABLE `VoteAudit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voteId` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `electionId` INTEGER NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RedefineIndex
CREATE INDEX `idx_vote_candidate` ON `Vote`(`candidateId`);
DROP INDEX `Vote_candidateId_fkey` ON `Vote`;

-- RedefineIndex
CREATE UNIQUE INDEX `unique_vote_per_user_per_election` ON `Vote`(`userId`, `electionId`);
DROP INDEX `Vote_userId_electionId_key` ON `Vote`;
