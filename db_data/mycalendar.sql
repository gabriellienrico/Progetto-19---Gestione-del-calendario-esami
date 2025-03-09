SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Tabella corsi
CREATE TABLE corsi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_corso VARCHAR(100) NOT NULL,
    anno_corso INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabella professori
CREATE TABLE professori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabella appelli
CREATE TABLE appelli (
    id int AUTO_INCREMENT PRIMARY KEY,
    corso INT NOT NULL,
    professore INT NOT NULL,
    opz_1 JSON NOT NULL,
    opz_2 JSON NOT NULL,
    opz_agg JSON NOT NULL,
    FOREIGN KEY (corso) REFERENCES corsi(id) ON DELETE CASCADE,
    FOREIGN KEY (professore) REFERENCES professori(id) ON DELETE CASCADE,
    CHECK (
        JSON_VALID(opz_1) AND JSON_VALID(opz_2) AND JSON_VALID(opz_agg) -- Verifica che siano JSON validi
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabella utenti
CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ruolo ENUM('admin', 'user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Inserimento corsi
INSERT INTO corsi (nome_corso, anno_corso) VALUES
('Fondamenti di Programmazione', 1),
('Analisi Matematica', 1),
('Architettura degli Elaboratori', 1),
('Algebra e Geometria', 1),
('Algoritmi e Strutture Dati', 1),
('Fisica', 1),
('Elementi di Probabilità', 2),
('Basi di Dati', 2),
('Sistemi Informativi', 2),
('Sistemi Operativi', 2),
('Calcolo Numerico', 2),
('Fondamenti dell\'Informatica', 2),
('Laboratorio di Algoritmi e Strutture Dati', 2),
('Metodologie di Programmazione', 2),
('Ingegneria del Software', 3),
('Reti di Calcolatori', 3),
('Sistemi Informativi e Gestione d\'Impresa', 3),
('Intelligenza Artificiale', 3),
('Programmazione Parallela e HPC', 3);

-- Inserimento professori
INSERT INTO professori (nome, cognome, email) VALUES
('Gianfranco', 'Rossi', 'gianfranco.rossi@unipr.it'),
('Alessandro', 'Zaccagnini', 'alessandro.zaccagnini@unipr.it'),
('Giuseppe', 'Cota', 'giuseppe.cota@unipr.it'),
('Alessandro', 'Dal Palù', 'alessandro.dalpalu@unipr.it'),
('Anna', 'Benini', 'anna.benini@unipr.it'),
('Federico', 'Bergenti', 'federico.bergenti@unipr.it'),
('Roberto', 'De Pietri', 'roberto.depietri@unipr.it'),
('Francesco', 'Morandin', 'francesco.morandin@unipr.it'),
('Enea', 'Zaffanella', 'enea.zaffanella@unipr.it'),
('Giulio', 'Destri', 'giulio.destri@unipr.it'),
('Flavio', 'Bertini', 'flavio.bertini@unipr.it'),
('Chiara', 'Guardasoni', 'chiara.guardasoni@unipr.it'),
('Roberto', 'Bagnara', 'roberto.bagnara@unipr.it'),
('Roberto', 'Alfieri', 'roberto.alfieri@unipr.it'),
('Armando', 'Sternieri', 'armando.sternieri@unipr.it'),
('Vincenzo', 'Bonnici', 'vincenzo.bonnici@unipr.it');

-- Inserimento appelli
INSERT INTO appelli (corso, professore, opz_1, opz_2, opz_agg) VALUES
(
    1, -- Fondamenti di Programmazione
    1, -- Gianfranco Rossi
    '{"data": "2025-01-10", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-14", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),

(
    2, -- Analisi Matematica
    2, -- Alessandro Zaccagnini
    '{"data": "2025-01-09", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"data": "2025-01-14", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"agg": "false", "info": ""}'
),

(
    3, -- Architettura degli Elaboratori
    3, -- Giuseppe Cota
    '{"data": "2025-01-07", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-01-08", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"agg": "false", "info": ""}'
),

(
    4, -- Algebra e Geometria
    5, -- Anna Benini
    '{"data": "2025-01-16", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-14", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),

(
    5, -- Algoritmi e Strutture Dati
    16, -- Vincenzo Bonnici
    '{"data": "2025-01-09", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"data": "2025-01-13", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"agg": "false", "info": ""}'
),

(
    6, -- Fisica
    7, -- Roberto De Pietri
    '{"data": "2025-01-17", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-01-20", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "false", "info": ""}'
),

(
    7, -- Elementi di Probabilità
    8, -- Francesco Morandin
    '{"data": "2025-01-20", "orario_inizio": "14:30", "orario_fine": "16:30"}',
    '{"data": "2025-01-17", "orario_inizio": "09:30", "orario_fine": "11:30"}',
    '{"agg": "false", "info": ""}'
),

(
    8, -- Basi di Dati
    9, -- Enea Zaffanella
    '{"data": "2025-01-09", "orario_inizio": "09:30", "orario_fine": "11:30"}',
    '{"data": "2025-01-10", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "true", "info": "Gli studenti che prenderanno un voto >25 alla prova scritta dovranno sostenere una prova orale in data che verrà comunicata dal docente."}'
),

(
    9, -- Sistemi Informativi
    10, -- Giulio Destri
    '{"data": "2025-01-07", "orario_inizio": "14:30", "orario_fine": "16:00"}',
    '{"data": "2025-01-06", "orario_inizio": "09:00", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),

(
    10, -- Sistemi Operativi
    11, -- Flavio Bertini
    '{"data": "2025-01-16", "orario_inizio": "14:30", "orario_fine": "16:00"}',
    '{"data": "2025-01-20", "orario_inizio": "09:00", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),

(
    11, -- Calcolo Numerico
    12, -- Chiara Guardasoni
    '{"data": "2025-01-20", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-23", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),

(
    12, -- Fondamenti dell'Informatica
    13, -- Roberto Bagnara
    '{"data": "2025-01-09", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"data": "2025-01-13", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),

(
    13, -- Laboratorio di Algoritmi e Strutture Dati
    4, -- Alessandro Dal Palù
    '{"data": "2025-01-07", "orario_inizio": "14:00", "orario_fine": "18:00"}',
    '{"data": "2025-01-10", "orario_inizio": "10:00", "orario_fine": "14:00"}',
    '{"agg": "false", "info": ""}'
),

(
    14, -- Metodologie di Programmazione
    9, -- Enea Zaffanella
    '{"data": "2025-01-08", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"data": "2025-01-07", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"agg": "true", "info": "Gli studenti che prenderanno un voto >25 alla prova scritta dovranno sostenere una prova orale in data che verrà comunicata dal docente."}'
),

(
    15, -- Ingegneria del Software
    16, -- Vincenzo Bonnici
    '{"data": "2025-01-15", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-01-06", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "Gli studenti che passeranno lo scritto dovranno sottoporsi a un orale, che consiste nella presentazione di un progetto, in data da concordare con il docente."}'
),

(
    16, -- Reti di Calcolatori
    14, -- Roberto Alfieri
    '{"data": "2025-01-08", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-09", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "true", "info": "In caso di passaggio della prova scritta, è prevista una prova orale indicativamente una settimana dopo la prova scritta."}'
),

(
    17, -- Sistemi Informativi e Gestione d'Impresa
    15, -- Armando Sternieri
    '{"data": "2025-01-14", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"data": "2025-01-16", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"agg": "false", "info": ""}'
),

(
    18, -- Intelligenza Artificiale
    6, -- Federico Bergenti
    '{"data": "2025-01-07", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-01-09", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "La prova orale può essere richiesta a discrezione del docente."}'
),

(
    19, -- Programmazione Parallela e HPC
    14, -- Roberto Alfieri
    '{"data": "2025-01-23", "orario_inizio": "09:00", "orario_fine": "18:00"}',
    '{"data": "2025-01-20", "orario_inizio": "09:00", "orario_fine": "18:00"}',
    '{"agg": "false", "info": ""}'
),


(
    1, -- Fondamenti di Programmazione
    1, -- Gianfranco Rossi
    '{"data": "2025-01-17", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-21", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),
(
    1, -- Fondamenti di Programmazione
    1, -- Gianfranco Rossi
    '{"data": "2025-01-24", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-31", "orario_inizio": "08:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),
(
    2, -- Analisi Matematica
    2, -- Alessandro Zaccagnini
    '{"data": "2025-01-23", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"data": "2025-01-28", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"agg": "false", "info": ""}'
),
(
    2, -- Analisi Matematica
    2, -- Alessandro Zaccagnini
    '{"data": "2025-02-06", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"data": "2025-02-11", "orario_inizio": "13:30", "orario_fine": "15:30"}',
    '{"agg": "false", "info": ""}'
),
(
    3, -- Architettura degli Elaboratori
    3, -- Giuseppe Cota
    '{"data": "2025-02-12", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-02-11", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"agg": "false", "info": ""}'
),
(
    4, -- Algebra e Geometria
    5, -- Anna Benini
    '{"data": "2025-01-31", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-28", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),
(
    5, -- Algoritmi e Strutture Dati
    16, -- Vincenzo Bonnici
    '{"data": "2025-02-03", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"data": "2025-02-06", "orario_inizio": "10:00", "orario_fine": "12:00"}',
    '{"agg": "false", "info": ""}'
),
(
    6, -- Fisica
    7, -- Roberto De Pietri
    '{"data": "2025-02-06", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-02-07", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "false", "info": ""}'
),
(
    7, -- Elementi di Probabilità
    8, -- Francesco Morandin
    '{"data": "2025-02-07", "orario_inizio": "14:30", "orario_fine": "16:30"}',
    '{"data": "2025-02-10", "orario_inizio": "09:30", "orario_fine": "11:30"}',
    '{"agg": "false", "info": ""}'
),
(
    8, -- Basi di Dati
    9, -- Enea Zaffanella
    '{"data": "2025-01-27", "orario_inizio": "09:30", "orario_fine": "11:30"}',
    '{"data": "2025-01-29", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "true", "info": "Gli studenti che prenderanno un voto >25 alla prova scritta dovranno sostenere una prova orale in data che verrà comunicata dal docente."}'
),
(
    9, -- Sistemi Informativi
    10, -- Giulio Destri
    '{"data": "2025-01-21", "orario_inizio": "14:30", "orario_fine": "16:00"}',
    '{"data": "2025-01-20", "orario_inizio": "09:00", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),
(
    9, -- Sistemi Informativi
    10, -- Giulio Destri
    '{"data": "2025-02-04", "orario_inizio": "09:30", "orario_fine": "11:00"}',
    '{"data": "2025-02-03", "orario_inizio": "09:00", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),
(
    10, -- Sistemi Operativi
    11, -- Flavio Bertini
    '{"data": "2025-01-31", "orario_inizio": "14:30", "orario_fine": "16:00"}',
    '{"data": "2025-01-29", "orario_inizio": "09:00", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),
(
    11, -- Calcolo Numerico
    12, -- Chiara Guardasoni
    '{"data": "2025-02-11", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-02-10", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "false", "info": ""}'
),
(
    12, -- Fondamenti dell'Informatica
    13, -- Roberto Bagnara
    '{"data": "2025-01-23", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"data": "2025-01-22", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"agg": "false", "info": ""}'
),
(
    13, -- Laboratorio di Algoritmi e Strutture Dati
    4, -- Alessandro Dal Palù
    '{"data": "2025-02-12", "orario_inizio": "14:00", "orario_fine": "18:00"}',
    '{"data": "2025-02-11", "orario_inizio": "10:00", "orario_fine": "14:00"}',
    '{"agg": "false", "info": ""}'
),
(
    14, -- Metodologie di Programmazione
    9, -- Enea Zaffanella
    '{"data": "2025-01-22", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"data": "2025-01-21", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"agg": "true", "info": "Gli studenti che prenderanno un voto >25 alla prova scritta dovranno sostenere una prova orale in data che verrà comunicata dal docente."}'
),
(
    14, -- Metodologie di Programmazione
    9, -- Enea Zaffanella
    '{"data": "2025-02-05", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"data": "2025-02-06", "orario_inizio": "08:30", "orario_fine": "10:30"}',
    '{"agg": "true", "info": "Gli studenti che prenderanno un voto >25 alla prova scritta dovranno sostenere una prova orale in data che verrà comunicata dal docente."}'
),
(
    15, -- Ingegneria del Software
    16, -- Vincenzo Bonnici
    '{"data": "2025-01-29", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-01-31", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "Gli studenti che passeranno lo scritto dovranno sottoporsi a un orale, che consiste nella presentazione di un progetto, in data da concordare con il docente."}'
),
(
    15, -- Ingegneria del Software
    16, -- Vincenzo Bonnici
    '{"data": "2025-02-14", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-02-11", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "Gli studenti che passeranno lo scritto dovranno sottoporsi a un orale, che consiste nella presentazione di un progetto, in data da concordare con il docente."}'
),
(
    16, -- Reti di Calcolatori
    14, -- Roberto Alfieri
    '{"data": "2025-01-22", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-01-23", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "true", "info": "In caso di passaggio della prova scritta, è prevista una prova orale indicativamente una settimana dopo la prova scritta."}'
),
(
    16, -- Reti di Calcolatori
    14, -- Roberto Alfieri
    '{"data": "2025-02-06", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"data": "2025-02-05", "orario_inizio": "10:30", "orario_fine": "12:30"}',
    '{"agg": "true", "info": "In caso di passaggio della prova scritta, è prevista una prova orale indicativamente una settimana dopo la prova scritta."}'
),
(
    17, -- Sistemi Informativi e Gestione d'Impresa
    15, -- Armando Sternieri
    '{"data": "2025-01-28", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"data": "2025-01-31", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"agg": "false", "info": ""}'
),
(
    17, -- Sistemi Informativi e Gestione d'Impresa
    15, -- Armando Sternieri
    '{"data": "2025-02-11", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"data": "2025-02-14", "orario_inizio": "15:00", "orario_fine": "17:00"}',
    '{"agg": "false", "info": ""}'
),
(
    18, -- Intelligenza Artificiale
    6, -- Federico Bergenti
    '{"data": "2025-01-30", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-02-03", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "La prova orale può essere richiesta a discrezione del docente."}'
),
(
    18, -- Intelligenza Artificiale
    6, -- Federico Bergenti
    '{"data": "2025-02-12", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"data": "2025-02-17", "orario_inizio": "09:00", "orario_fine": "11:00"}',
    '{"agg": "true", "info": "La prova orale può essere richiesta a discrezione del docente."}'
),
(
    19, -- Programmazione Parallela e HPC
    14, -- Roberto Alfieri
    '{"data": "2025-02-13", "orario_inizio": "09:00", "orario_fine": "18:00"}',
    '{"data": "2025-02-10", "orario_inizio": "09:00", "orario_fine": "18:00"}',
    '{"agg": "false", "info": ""}'
);

-- Inserimento utenti
INSERT INTO utenti (email, password, ruolo) VALUES
('admin@example.com', '$2a$12$fHtPHFhRqw./KF5BjVq0Ru2s.V3ShWfZXocwUpmBsBZnPb50Ju.Hm', 'admin');


COMMIT;