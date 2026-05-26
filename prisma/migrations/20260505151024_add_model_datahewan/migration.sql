-- CreateTable
CREATE TABLE `Data_Hewan` (
    `id` VARCHAR(191) NOT NULL,
    `nama_majikan` VARCHAR(191) NOT NULL,
    `nama_hewan` VARCHAR(191) NOT NULL,
    `umur_hewan` DOUBLE NOT NULL,
    `beratbadan_hewan` DOUBLE NOT NULL,
    `jenis_hewan` VARCHAR(191) NOT NULL,
    `waktu_penitipan` DOUBLE NOT NULL,
    `tanggal_penitipan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
