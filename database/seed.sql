-- ===================================================
-- Seed Data (ข้อมูลตัวอย่างสำหรับทดสอบ)
-- ===================================================

INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`, `role`) VALUES
('สมพร', 'ดีใจ', 'sompdjai@gmail.com', '1234567', 'ครู/อาจารย์'),
('เฮเลน่า', 'เวดส์', 'helenawades@gmail.com', 'h123w456', 'ครู/อาจารย์'),
('สัญจิตา', 'มองกอล', 'sanchita.m@ku.th', '1234noel', 'นักเรียน/นักศึกษา');

INSERT INTO `categories` (`category`) VALUES
('Math'), ('Science'), ('Bio'), ('Chem'), ('Physics'), ('History'), ('English'), ('Programming');

INSERT INTO `levels` (`level`) VALUES
('มัธยมศึกษาตอนต้น'), ('มัธยมศึกษาตอนปลาย'), ('มหาวิทยาลัย');

INSERT INTO `courses` (`title`, `description`, `category_id`, `level_id`, `teacher_id`) VALUES
('แคลคูลัสเบื้องต้น (Calculus 1)', 'พื้นฐานลิมิต อนุพันธ์ และอินทิกรัล', 1, 3, 1),
('Introduction to Programming', 'เรียนพื้นฐานการเขียนโปรแกรม', 8, 3, 1),
('English Grammar Basics', 'เรียนไวยากรณ์ภาษาอังกฤษเบื้องต้น', 7, 1, 2);

INSERT INTO `lessons` (`course_id`, `title`, `description`, `video_url`, `position`) VALUES
(1, 'บทที่ 1 ลิมิต', 'Introduction to limit', '/uploads/video1.mp4', 1),
(1, 'บทที่ 2 อนุพันธ์', 'Derivative basics', '/uploads/video2.mp4', 2),
(3, 'บทที่ 1 Parts of Speech', 'ชนิดของคำในภาษาอังกฤษ', '/uploads/video3.mp4', 1);

INSERT INTO `quizzes` (`lesson_id`, `question`) VALUES
(1, 'lim x→2 (3x + 1) มีค่าเท่าใด?'),
(1, 'lim x→0 (x² + x) / x มีค่าเท่าใด?'),
(1, 'lim x→3 (x² - 4) มีค่าเท่าใด?'),
(1, 'lim x→1 (x² - 1) / (x - 1) มีค่าเท่าใด?');

INSERT INTO `quiz_choices` (`quiz_id`, `choice_text`,`is_correct`) VALUES
(1, '5',0),
(1, '6',0),
(1, '7',1),
(1, '8',0),

(2, '0',0),
(2, '1',1),
(2, '2',0),
(2, 'ไม่กำหนด',0),

(3, '3',0),
(3, '4',0),
(3, '5',1),
(3, '6',0),

(4, '0',0),
(4, '1',0),
(4, '2',1),
(4, '3',0);

INSERT INTO `enrollments` (`user_id`, `course_id`) VALUES
(3, 1),
(3, 3);

INSERT INTO `progress` (`student_id`, `lesson_id`, `completed`) VALUES
(3, 1, true),
(3, 2, true),
(3, 3, false);

INSERT INTO `quiz_attempts` (`quiz_id`, `student_id`, `student_answer`, `score`) VALUES
(1, 3, '7', 1);