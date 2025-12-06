-- XAMPP-friendly MySQL initialization for Task Flow
-- This file is tailored for XAMPP's default MySQL/MariaDB setup (usually `root`@`localhost` with no password)

CREATE DATABASE IF NOT EXISTS `task_flow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `task_flow_db`;

-- Example `tasks` table
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `completed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes for XAMPP:
-- - XAMPP typically runs MySQL (or MariaDB) with a `root` user and no password by default.
-- - This script DOES NOT create a database user; it expects you to either use `root` or create a user via phpMyAdmin or the MySQL console.
-- - To import via phpMyAdmin: open phpMyAdmin (http://localhost/phpmyadmin) -> Import -> choose this file -> Go.
-- - To import from PowerShell using XAMPP's mysql client (adjust path if XAMPP installed elsewhere):
--     & 'C:\xampp\mysql\bin\mysql.exe' -u root < .\db\init_xampp.sql
-- - If you've set a password for `root`, add `-p` to the command and you'll be prompted for it:
--     & 'C:\xampp\mysql\bin\mysql.exe' -u root -p < .\db\init_xampp.sql

-- Security:
-- - For production use, create a dedicated database user with limited privileges and avoid using `root`.
-- - You can later create a user and grant permissions using phpMyAdmin or the mysql client.
