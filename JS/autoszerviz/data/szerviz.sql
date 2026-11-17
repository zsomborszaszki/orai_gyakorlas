-- =====================================================
-- 43. feladat - Autószerviz (ügyfél -> munkalap <-> alkatrész)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot (a készlet is).
-- Az adatok kitaláltak. A munkadíj óradíja 12 000 Ft.
-- =====================================================

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS `szerviz` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `szerviz`;

DROP TABLE IF EXISTS `felhasznalasok`;
DROP TABLE IF EXISTS `munkalapok`;
DROP TABLE IF EXISTS `alkatreszek`;
DROP TABLE IF EXISTS `ugyfelek`;

CREATE TABLE `ugyfelek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `munkalapok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ugyfel_id` int(11) NOT NULL,
  `rendszam` varchar(10) NOT NULL,
  `felvetel` date NOT NULL,
  `leiras` varchar(100) NOT NULL,
  `statusz` enum('felvéve','javítás alatt','kész','átadva') NOT NULL DEFAULT 'felvéve',
  `munkaora` decimal(4,1) NOT NULL DEFAULT 0.0,
  PRIMARY KEY (`id`),
  KEY `fk_munkalapok_ugyfel` (`ugyfel_id`),
  CONSTRAINT `fk_munkalapok_ugyfel` FOREIGN KEY (`ugyfel_id`) REFERENCES `ugyfelek` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `alkatreszek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  `ar` int(11) NOT NULL COMMENT 'Ft / db',
  `keszlet` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_alkatreszek_keszlet` CHECK (`keszlet` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `felhasznalasok` (
  `munkalap_id` int(11) NOT NULL,
  `alkatresz_id` int(11) NOT NULL,
  `db` int(11) NOT NULL,
  PRIMARY KEY (`munkalap_id`, `alkatresz_id`),
  KEY `fk_felh_alkatresz` (`alkatresz_id`),
  CONSTRAINT `fk_felh_munkalap` FOREIGN KEY (`munkalap_id`) REFERENCES `munkalapok` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_felh_alkatresz` FOREIGN KEY (`alkatresz_id`) REFERENCES `alkatreszek` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `ugyfelek` (`id`, `nev`, `telefon`) VALUES
(1, 'Horváth Péter', '+36 30 123 4567'),
(2, 'Kiss Júlia', '+36 20 234 5678'),
(3, 'Molnár Ádám', '+36 70 345 6789'),
(4, 'Fekete Zsófia', '+36 30 456 7890');

INSERT INTO `munkalapok` (`id`, `ugyfel_id`, `rendszam`, `felvetel`, `leiras`, `statusz`, `munkaora`) VALUES
(1, 1, 'AAA-111', '2026-10-02', 'Olajcsere, szűrők', 'átadva', 2.5),
(2, 2, 'BBB-222', '2026-10-08', 'Fékbetétcsere elöl', 'átadva', 4.0),
(3, 3, 'CCC-333', '2026-10-20', 'Kuplungcsere', 'kész', 6.0),
(4, 1, 'AAA-111', '2026-11-03', 'Gyújtógyertya-csere', 'javítás alatt', 1.5),
(5, 2, 'DDD-444', '2026-11-09', 'Műszaki vizsga előtti átvizsgálás', 'felvéve', 0.0),
(6, 3, 'CCC-333', '2026-11-10', 'Zörgő hang a futóműből', 'felvéve', 0.0);

INSERT INTO `alkatreszek` (`id`, `nev`, `ar`, `keszlet`) VALUES
(1, 'Motorolaj 5W-30 (1 l)', 4200, 20),
(2, 'Olajszűrő', 3500, 4),
(3, 'Levegőszűrő', 4800, 2),
(4, 'Fékbetét (első)', 18900, 1),
(5, 'Kuplungszett', 89000, 0),
(6, 'Gyújtógyertya', 2900, 12),
(7, 'Ablaktörlő lapát', 3900, 6);

INSERT INTO `felhasznalasok` (`munkalap_id`, `alkatresz_id`, `db`) VALUES
(1, 1, 4), (1, 2, 1), (1, 3, 1),
(2, 4, 1),
(3, 5, 1),
(4, 6, 4);
