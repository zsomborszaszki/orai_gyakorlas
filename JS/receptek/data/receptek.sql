-- =====================================================
-- 42. feladat - Receptek (recept <-> hozzávaló, N:M mennyiséggel)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- Az adatok és az árak kitaláltak.
-- =====================================================

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS `receptek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `receptek`;

DROP TABLE IF EXISTS `recept_hozzavalok`;
DROP TABLE IF EXISTS `hozzavalok`;
DROP TABLE IF EXISTS `receptek`;

CREATE TABLE `receptek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `kategoria` enum('reggeli','leves','főétel','desszert') NOT NULL,
  `adag` int(11) NOT NULL,
  `ido` int(11) NOT NULL COMMENT 'elkészítési idő, perc',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `hozzavalok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  `mertekegyseg` enum('g','ml','db') NOT NULL,
  `egysegar` decimal(8,2) NOT NULL COMMENT 'Ft / mértékegység',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hozzavalok_nev` (`nev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `recept_hozzavalok` (
  `recept_id` int(11) NOT NULL,
  `hozzavalo_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL,
  PRIMARY KEY (`recept_id`, `hozzavalo_id`),
  KEY `fk_rh_hozzavalo` (`hozzavalo_id`),
  CONSTRAINT `fk_rh_recept` FOREIGN KEY (`recept_id`) REFERENCES `receptek` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rh_hozzavalo` FOREIGN KEY (`hozzavalo_id`) REFERENCES `hozzavalok` (`id`),
  CONSTRAINT `chk_rh_mennyiseg` CHECK (`mennyiseg` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `receptek` (`id`, `nev`, `kategoria`, `adag`, `ido`) VALUES
(1, 'Palacsinta', 'desszert', 4, 30),
(2, 'Csirkepaprikás', 'főétel', 4, 60),
(3, 'Rántotta', 'reggeli', 2, 10),
(4, 'Krumplileves', 'leves', 4, 45),
(5, 'Kakaós csiga', 'desszert', 8, 90),
(6, 'Rakott krumpli', 'főétel', 4, 75);

INSERT INTO `hozzavalok` (`id`, `nev`, `mertekegyseg`, `egysegar`) VALUES
(1, 'liszt', 'g', 0.35),
(2, 'cukor', 'g', 0.45),
(3, 'tojás', 'db', 85.00),
(4, 'tej', 'ml', 0.40),
(5, 'vaj', 'g', 3.20),
(6, 'csirkemell', 'g', 3.60),
(7, 'pirospaprika', 'g', 6.00),
(8, 'vöröshagyma', 'g', 0.50),
(9, 'tejföl', 'g', 1.40),
(10, 'burgonya', 'g', 0.30),
(11, 'sajt', 'g', 4.50),
(12, 'kakaópor', 'g', 5.00),
(13, 'élesztő', 'g', 2.00),
(14, 'só', 'g', 0.15),
(15, 'fahéj', 'g', 8.00);

INSERT INTO `recept_hozzavalok` (`recept_id`, `hozzavalo_id`, `mennyiseg`) VALUES
(1, 1, 200), (1, 3, 2), (1, 4, 500), (1, 2, 20), (1, 14, 2),
(2, 6, 800), (2, 8, 150), (2, 7, 10), (2, 9, 200), (2, 1, 20), (2, 14, 8),
(3, 3, 4), (3, 5, 20), (3, 14, 2),
(4, 10, 600), (4, 8, 100), (4, 7, 5), (4, 9, 150), (4, 1, 20), (4, 14, 8),
(5, 1, 500), (5, 4, 250), (5, 13, 20), (5, 5, 80), (5, 2, 100), (5, 12, 30), (5, 3, 1),
(6, 10, 1000), (6, 3, 4), (6, 9, 400), (6, 5, 30), (6, 11, 100), (6, 14, 8);
