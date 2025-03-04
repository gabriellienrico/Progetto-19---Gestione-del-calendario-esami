SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE appelli (
    id int NOT NULL,
    course_name varchar(50) NOT NULL,
    course_year int NOT NULL,
    date_opt_1 varchar(50) NOT NULL,
    time_opt_1 varchar(50) NOT NULL,
    date_opt_2 varchar(50) NOT NULL,
    time_opt_2 varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO appelli (id, course_name, course_year, date_opt_1) VALUES
(1, 'Ingegneria del Software', '3', '03/12/2025');

COMMIT;