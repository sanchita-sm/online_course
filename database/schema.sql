-- ===================================================
-- online_course - Online Course System Schema (Fixed)
-- ===================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ===================================================
-- ตาราง users
-- แก้ไข: role เปลี่ยนจากภาษาไทยเป็น 'teacher' / 'student'
-- ===================================================
CREATE TABLE IF NOT EXISTS `users` (
    `id`            INT             NOT NULL AUTO_INCREMENT,
    `firstname`     VARCHAR(100)    NOT NULL,
    `lastname`      VARCHAR(100)    NOT NULL,
    `email`         VARCHAR(100)    NOT NULL UNIQUE,
    `password`      VARCHAR(255)    NOT NULL,
    `role`          ENUM('teacher','student') NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง categories
-- ความสัมพันธ์: categories (1) ── (many) courses
-- ===================================================
CREATE TABLE `categories` (
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `category`    VARCHAR(100)    NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง levels
-- ความสัมพันธ์: levels (1) ── (many) courses
-- ===================================================
CREATE TABLE `levels` (
  `id`      INT             NOT NULL AUTO_INCREMENT,
  `level`   VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง courses
-- ความสัมพันธ์: users (1) ── (many) courses
-- แก้ไข: เพิ่ม updated_at
-- ===================================================
CREATE TABLE `courses` (
    `id`            INT             NOT NULL AUTO_INCREMENT,
    `title`         VARCHAR(100)    NOT NULL,
    `description`   TEXT,
    `category_id`   INT             NOT NULL,
    `level_id`      INT             NOT NULL,
    `teacher_id`    INT             NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`category_id`),
    INDEX (`level_id`),
    INDEX (`teacher_id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`level_id`)    REFERENCES `levels`(`id`)     ON DELETE RESTRICT,
    FOREIGN KEY (`teacher_id`)  REFERENCES `users`(`id`)      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง lessons
-- ความสัมพันธ์: courses (1) ── (many) lessons
-- ===================================================
CREATE TABLE `lessons` (
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `course_id`   INT             NOT NULL,
  `title`       VARCHAR(255)    NOT NULL,
  `description` TEXT,
  `video_url`   VARCHAR(255)    NOT NULL,
  `position`    INT             NOT NULL,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (`course_id`, `position`),
  INDEX (`course_id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quizzes
-- ความสัมพันธ์: lessons (1) ── (many) quizzes
-- ===================================================
CREATE TABLE `quizzes` (
  `id`          INT     NOT NULL AUTO_INCREMENT,
  `lesson_id`   INT     NOT NULL,
  `question`    TEXT    NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`lesson_id`),
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quiz_choices
-- ความสัมพันธ์: quizzes (1) ── (many) quiz_choices
-- ===================================================
CREATE TABLE `quiz_choices` (
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `quiz_id`     INT             NOT NULL,
  `choice_text` VARCHAR(255)    NOT NULL,
  `is_correct`  BOOLEAN         DEFAULT FALSE,
  PRIMARY KEY (`id`),
  INDEX (`quiz_id`),
  FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง enrollments
-- ความสัมพันธ์: users(student) (1) ── (many) enrollments
--             courses (1) ── (many) enrollments
-- ===================================================
CREATE TABLE `enrollments` (
  `id`          INT     NOT NULL AUTO_INCREMENT,
  `student_id`  INT     NOT NULL,
  `course_id`   INT     NOT NULL,
  `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (`student_id`, `course_id`),
  INDEX (`student_id`),
  INDEX (`course_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`course_id`)  REFERENCES `courses`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง progress
-- ความสัมพันธ์: users(student) (1) ── (many) progress
--             lessons (1) ── (many) progress
-- ===================================================
CREATE TABLE `progress` (
  `id`            INT     NOT NULL AUTO_INCREMENT,
  `student_id`    INT     NOT NULL,
  `lesson_id`     INT     NOT NULL,
  `completed`     BOOLEAN DEFAULT FALSE,
  `completed_at`  TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`student_id`, `lesson_id`),
  INDEX (`student_id`),
  INDEX (`lesson_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`)  REFERENCES `lessons`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quiz_attempts
-- ความสัมพันธ์: quizzes (1) ── (many) quiz_attempts
--             users(student) (1) ── (many) quiz_attempts
-- แก้ไข: ตัด score ออก (คำนวณได้จาก is_correct)
--        เพิ่ม UNIQUE (quiz_id, student_id) ป้องกัน submit ซ้ำ
-- ===================================================
CREATE TABLE `quiz_attempts` (
  `id`                  INT         NOT NULL AUTO_INCREMENT,
  `quiz_id`             INT         NOT NULL,
  `student_id`          INT         NOT NULL,
  `selected_choice_id`  INT         NOT NULL,
  `submitted_at`        TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (`quiz_id`, `student_id`),
  INDEX (`quiz_id`),
  INDEX (`student_id`),
  CONSTRAINT `fk_attempt_quiz`            FOREIGN KEY (`quiz_id`)            REFERENCES `quizzes`(`id`)      ON DELETE CASCADE,
  CONSTRAINT `fk_attempt_student`         FOREIGN KEY (`student_id`)         REFERENCES `users`(`id`)        ON DELETE CASCADE,
  CONSTRAINT `fk_attempt_selected_choice` FOREIGN KEY (`selected_choice_id`) REFERENCES `quiz_choices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- Seed data
-- ===================================================
INSERT INTO `categories` (`category`) VALUES
  ('คณิตศาสตร์'),
  ('วิทยาศาสตร์'),
  ('ชีววิทยา'),
  ('เคมี'),
  ('ฟิสิกส์'),
  ('สังคมศึกษา'),
  ('ภาษาอังกฤษ'),
  ('โปรแกรมมิ่ง');

INSERT INTO `levels` (`level`) VALUES
  ('มัธยมศึกษาตอนต้น'),
  ('มัธยมศึกษาตอนปลาย'),
  ('มหาวิทยาลัย');

COMMIT;