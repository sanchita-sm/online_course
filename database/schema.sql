-- ===================================================
-- online_course - Online Course System Schema
-- ===================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ===================================================
-- ตาราง users
-- ===================================================
CREATE TABLE IF NOT EXISTS `users` (
    `id`            INT             NOT NULL AUTO_INCREMENT,
    `firstname`     varchar(100)    NOT NULL,
    `lastname`      varchar(100)    NOT NULL,
    `email`         varchar(100)    NOT NULL UNIQUE,
    `password`      varchar(255)    NOT NULL,
    `role`          enum('ครู/อาจารย์','นักเรียน/นักศึกษา')   NOT NULL,
    `created_at`    timestamp DEFAULT CURRENT_TIMESTAMP,
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
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `level`       VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง courses
-- ความสัมพันธ์: users (1) ── (many) courses
-- ===================================================
CREATE TABLE `courses` (
    `id`                INT             NOT NULL AUTO_INCREMENT,
    `title`             varchar(100)    NOT NULL,
    `description`       text,
    `category_id`       INT             NOT NULL,
    `level_id`          INT             NOT NULL,
    `teacher_id`        INT             NOT NULL,
    `created_at`        timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`category_id`),
    INDEX (`level_id`),
    INDEX (`teacher_id`),
    FOREIGN KEY (`category_id`) REFERENCES categories(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`level_id`) REFERENCES levels(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`teacher_id`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง lessons
-- ความสัมพันธ์: courses (1) ── (many) lessons
-- ===================================================
CREATE TABLE `lessons` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `course_id`       INT             NOT NULL,
  `title`           varchar(255)    NOT NULL,
  `description`     text,
  `video_url`       varchar(255)    NOT NULL,
  `position`        INT             NOT NULL,
  `created_at`      timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (course_id, position),
  INDEX (`course_id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quizzes
-- ความสัมพันธ์: lessons (1) ── (many) quizzes
-- ===================================================
CREATE TABLE `quizzes` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `lesson_id`       INT             NOT NULL,
  `question`        text            NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`lesson_id`),
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quiz_choices
-- ความสัมพันธ์: quizzes (1) ── (many) quiz_choices
-- ===================================================
CREATE TABLE quiz_choices (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `quiz_id`         INT             NOT NULL,
  `choice_text`     VARCHAR(255)    NOT NULL,
  `is_correct`      boolean DEFAULT FALSE,
  PRIMARY KEY (id),
  INDEX (quiz_id),
  FOREIGN KEY (`quiz_id`) REFERENCES quizzes(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง enrollments
-- ความสัมพันธ์: users(student) (1) ── (many) enrollments
--             courses (1) ── (many) enrollments
-- ===================================================
CREATE TABLE `enrollments` (
  `id`              INT     NOT NULL AUTO_INCREMENT,
  `student_id`      INT     NOT NULL,
  `course_id`       INT     NOT NULL,
  `enrolled_at`     timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (student_id, course_id),
  INDEX (student_id),
  INDEX (course_id),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง progress
-- ความสัมพันธ์: users(student) (1) ─── (many) progress
--            lessons (1) ─── (many) progress
-- ===================================================
CREATE TABLE `progress` (
  `id`              INT     NOT NULL AUTO_INCREMENT,
  `student_id`      INT     NOT NULL,
  `lesson_id`       INT     NOT NULL,
  `completed`       boolean DEFAULT false,
  `completed_at`    timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE (student_id, lesson_id),
  INDEX (`student_id`),
  INDEX (`lesson_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- ตาราง quizz_attempts
-- ความสัมพันธ์:  quizzes (1) ─── (many) quiz_attempts
--              users (student) (1) ─── (many) quiz_attempts
-- ===================================================
CREATE TABLE quiz_attempts (
  `id`              INT         NOT NULL AUTO_INCREMENT,
  `quiz_id`         INT         NOT NULL,
  `student_id`      INT         NOT NULL,
  `student_answer`  VARCHAR(255),
  `score`           INT         NOT NULL,
  `submitted_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX (`quiz_id`),
  INDEX (`student_id`),
  FOREIGN KEY (`quiz_id`) REFERENCES quizzes(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES users(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;