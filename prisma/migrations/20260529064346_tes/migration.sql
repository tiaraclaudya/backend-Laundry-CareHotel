/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Data_Hewan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_telepon` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    DROP COLUMN `username`,
    ADD COLUMN `alamat` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `no_telepon` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Data_Hewan`;

-- CreateTable
CREATE TABLE `informasi_pelanggan` (
    `id` VARCHAR(191) NOT NULL,
    `jenis_layanan` ENUM('cuci_lipat', 'cuci_kering', 'dry_cleaning') NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `no_telepon` VARCHAR(191) NOT NULL,
    `no_kamar` VARCHAR(191) NOT NULL,
    `sprei` INTEGER NOT NULL DEFAULT 0,
    `baju_kaos` INTEGER NOT NULL DEFAULT 0,
    `celana` INTEGER NOT NULL DEFAULT 0,
    `handuk` INTEGER NOT NULL DEFAULT 0,
    `sarung_bantal` INTEGER NOT NULL DEFAULT 0,
    `sarung_guling` INTEGER NOT NULL DEFAULT 0,
    `gaun_dress` INTEGER NOT NULL DEFAULT 0,
    `blazer` INTEGER NOT NULL DEFAULT 0,
    `jas` INTEGER NOT NULL DEFAULT 0,
    `kemeja_wol` INTEGER NOT NULL DEFAULT 0,
    `sweater_wol` INTEGER NOT NULL DEFAULT 0,
    `sutra_silk` INTEGER NOT NULL DEFAULT 0,
    `total_harga` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('belum_diproses', 'sedang_diproses', 'selesai', 'diambil') NOT NULL DEFAULT 'belum_diproses',
    `antarKeKamar` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kontak` (
    `id` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('belum_dibaca', 'sudah_dibaca') NOT NULL DEFAULT 'belum_dibaca',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
