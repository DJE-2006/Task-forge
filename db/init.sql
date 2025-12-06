-- MySQL initialization for Task Flow
-- Change the password and user as needed before running in production

CREATE DATABASE IF NOT EXISTS `task_flow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (change password)
CREATE USER IF NOT EXISTS 'taskflow'@'localhost' IDENTIFIED BY 'ChangeMe123!';
GRANT ALL PRIVILEGES ON `task_flow_db`.* TO 'taskflow'@'localhost';
FLUSH PRIVILEGES;

USE `task_flow_db`;

-- Example `tasks` table
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `completed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- How to import on Windows PowerShell:
-- 1) Open PowerShell and run the MySQL client (ensure MySQL is installed and `mysql` is in PATH)
--    mysql -u root -p < .\db\init.sql
-- 2) Or run from within MySQL client:
--    mysql -u root -p
--    then at the mysql prompt: SOURCE C:/path/to/task-flow/db/init.sql;

-- Notes:
-- - Replace 'ChangeMe123!' with a strong password and/or create a different user as needed.
-- - If you prefer not to create a DB user here, remove the CREATE USER/GRANT lines and run only the CREATE DATABASE and table statements.
