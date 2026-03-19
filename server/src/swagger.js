const spec = {
    openapi: '3.0.0',
    info: {
        title: 'Online Course Task Management API',
        version: '1.0.0',
        description: 'REST API สำหรับระบบจัดการคอร์สเรียนออนไลน์'
    },
    servers: [{ url: 'http://localhost:8000', description: 'Local server' }],
    tags: [
        { name: 'Users', description: 'จัดการผู้ใช้งาน' },
        { name: 'Courses', description: 'จัดการคอร์สเรียน' },
        { name: 'Lessons', description: 'จัดการบทเรียน' },
        { name: 'Enrollments', description: 'จัดการการลงทะเบียนเรียน' },
        { name: 'Quiz', description: 'จัดการแบบทดสอบ' }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'connect.sid'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    firstname: { type: 'string', example: 'สมพร' },
                    lastname: { type: 'string', example: 'ดีใจ' },
                    email: { type: 'string', format: 'email', example: 'sompdjai@gmail.com' },
                    role: { type: 'string', enum: ['teacher', 'student'], example: 'teacher' },
                    created_at: { type: 'string', format: 'date-time' }
                }
            },
            UserInput: {
                type: 'object',
                required: ['firstname', 'lastname', 'email', 'password', 'role'],
                properties: {
                    firstname: { type: 'string', example: 'สมพร' },
                    lastname: { type: 'string', example: 'ดีใจ' },
                    email: { type: 'string', format: 'email', example: 'sompdjai@gmail.com' },
                    password: { type: 'string', example: '1234567' },
                    role: { type: 'string', enum: ['teacher', 'student'], example: 'teacher' }
                }
            },
            Login: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email', example: 'sompdjai@gmail.com' },
                    password: { type: 'string', example: '1234567' }
                }
            },
            LoginInput: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'sompdjai@gmail.com' },
                    password: { type: 'string', example: '1234567' }
                }
            },
            Category: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    category: { type: 'string', example: 'คณิตศาสตร์' }
                }
            },
            CategoryInput: {
                type: 'object',
                required: ['category'],
                properties: {
                    category: { type: 'string', example: 'คณิตศาสตร์' }
                }
            },
            Level: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    level: { type: 'string', example: 'มัธยมศึกษาตอนต้น' }
                }
            },
            LevelInput: {
                type: 'object',
                required: ['level'],
                properties: {
                    category: { type: 'string', example: 'มัธยมศึกษาตอนต้น' }
                }
            },
            Course: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    title: { type: 'string', example: 'แคลคูลัสเบื้องต้น (Calculus 1)' },
                    description: { type: 'string', example: 'พื้นฐานลิมิต อนุพันธ์ และอินทิกรัล' },
                    category_id: { type: 'integer', example: 1 },
                    level_id: { type: 'integer', example: 3 },
                    teacher_id: { type: 'integer', example: 1 },
                    created_at: { type: 'string', format: 'date-time' }
                }
            },
            CourseWithLessons: {
                allOf: [
                    { $ref: '#/components/schemas/Course' },
                    {
                        type: 'object',
                        properties: {
                            lessons: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Lesson' }
                            }
                        }
                    }
                ]
            },
            CourseInput: {
                type: 'object',
                required: ['title', 'description', 'category_id', 'level_id', 'teacher_id'],
                properties: {
                    title: { type: 'string', example: 'แคลคูลัสเบื้องต้น (Calculus 1)' },
                    description: { type: 'string', example: 'พื้นฐานลิมิต อนุพันธ์ และอินทิกรัล' },
                    category_id: { type: 'integer', example: 1 },
                    level_id: { type: 'integer', example: 3 },
                    teacher_id: { type: 'integer', example: 1 }
                }
            },
            Lesson: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    course_id: { type: 'integer', example: 1 },
                    title: { type: 'string', example: 'บทที่ 1 ลิมิต' },
                    description: { type: 'string', example: 'Introduction to limit' },
                    video_url: { type: 'string', example: '/uploads/video1.mp4' },
                    position: { type: 'integer', example: 1 },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            LessonWithQuizzes: {
                allOf: [
                    { $ref: '#/components/schemas/Lesson' },
                    {
                        type: 'object',
                        properties: {
                            quizzes: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Quiz' }
                            }
                        }
                    }
                ]
            },
            LessonInput: {
                type: 'object',
                required: ['course_id', 'title', 'description', 'video_url', 'position'],
                properties: {
                    course_id: { type: 'integer', example: 1 },
                    title: { type: 'string', example: 'บทที่ 1 ลิมิต' },
                    description: { type: 'string', example: 'Introduction to limit' },
                    video_url: { type: 'string', example: '/uploads/video1.mp4' },
                    position: { type: 'integer', example: 1 }
                }
            },
            Enrollment: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    student_id: { type: 'integer', example: 3 },
                    course_id: { type: 'integer', example: 1 },
                    enrolled_at: { type: 'string', format: 'date-time' }
                }
            },
            CourseWithStudents: {
                allOf: [
                    { $ref: '#/components/schemas/Course' },
                    {
                        type: 'object',
                        properties: {
                            students: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                ]
            },
            StudentWithCourses: {
                allOf: [
                    { $ref: '#/components/schemas/User' },
                    {
                        type: 'object',
                        properties: {
                            courses: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Course' }
                            }
                        }
                    }
                ]
            },
            EnrollmentInput: {
                type: 'object',
                required: ['student_id', 'course_id'],
                properties: {
                    student_id: { type: 'integer', example: 3 },
                    course_id: { type: 'integer', example: 1 }
                }
            },
            Quiz: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    lesson_id: { type: 'integer', example: 1 },
                    question: { type: 'string', example: 'lim x→2 (3x + 1) มีค่าเท่าใด?' }
                }
            },
            QuizChoice: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 5 },
                    quiz_id: { type: 'integer', example: 1 },
                    choice_text: { type: 'string', example: '7' },
                    is_correct: { type: 'boolean', example: true }
                }
            },
            QuizWithLesson: {
                allOf: [
                    { $ref: '#/components/schemas/Quiz' },
                    {
                        type: 'object',
                        properties: {
                            lesson: { $ref: '#/components/schemas/Lesson' }
                        }
                    }
                ]
            },
            QuizAttempt: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    quiz_id: { type: 'integer', example: 1 },
                    student_id: { type: 'integer', example: 2 },
                    selected_choice_id: { type: 'integer', example: 5 },
                    is_correct: { type: 'boolean', example: true },
                    submitted_at: { type: 'string', format: 'date-time' }
                }
            },
            QuizAttemptWithDetail: {
                allOf: [
                    { $ref: '#/components/schemas/QuizAttempt' },
                    {
                        type: 'object',
                        properties: {
                            student: { $ref: '#/components/schemas/User' },
                            quiz: { $ref: '#/components/schemas/Quiz' },
                            choice: { $ref: '#/components/schemas/QuizChoice' }
                        }
                    }
                ]
            },
            ChoiceInput: {
                type: 'object',
                required: ['choice_text', 'is_correct'],
                properties: {
                    choice_text: { type: 'string', example: '7' },
                    is_correct: { type: 'boolean', example: true }
                }
            },
            QuizInput: {
                type: 'object',
                required: ['lesson_id', 'question', 'choices'],
                properties: {
                    lesson_id: { type: 'integer', example: 1 },
                    question: { type: 'string', example: 'lim x→2 (3x + 1) มีค่าเท่าใด?' },
                    choices: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ChoiceInput' }
                    }
                }
            },
            QuizSubmitInput: {
                type: 'object',
                required: ['quiz_id', 'student_id', 'selected_choice_id'],
                properties: {
                    quiz_id: { type: 'integer', example: 1 },
                    student_id: { type: 'integer', example: 2 },
                    selected_choice_id: { type: 'integer', example: 5 }
                }
            },
            SuccessMessage: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'insert ok' },
                    data: { type: 'object' }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'กรอกข้อมูลไม่ครบ' },
                    errors: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    },
    security: [{ cookieAuth: [] }],
    paths: {
        // ─── Users ─────────────────────────────────────────────────────────────────
        '/users/register': {
            post: {
                tags: ['Users'],
                summary: 'สมัครสมาชิกผู้ใช้ใหม่',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } }
                },
                responses: {
                    201: { description: 'Register success', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ครบหรือซ้ำ', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/users/login': {
            post: {
                tags: ['Users'],
                summary: 'เข้าสู่ระบบ',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } }
                },
                responses: {
                    200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    401: { description: 'Email หรือ password ไม่ถูกต้อง', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/users/logout': {
            post: {
                tags: ['Users'],
                summary: 'ออกจากระบบ',
                responses: {
                    200: { description: 'Logout success', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }
                }
            }
        },
        '/users': {
            get: {
                tags: ['Users'],
                summary: 'ดึงรายชื่อผู้ใช้ทั้งหมด',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'รายชื่อผู้ใช้', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
                }
            }
        },
        '/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'ดึงข้อมูลผู้ใช้ตาม ID',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'ข้อมูลผู้ใช้', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    404: { description: 'ไม่พบผู้ใช้', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            put: {
                tags: ['Users'],
                summary: 'แก้ไขข้อมูลผู้ใช้',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
                responses: { 200: { description: 'แก้ไขสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } } }
            },
            delete: {
                tags: ['Users'],
                summary: 'ลบผู้ใช้',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } } }
            }
        },
        // ─── Categories ─────────────────────────────────────────────────────────────────
        '/categories': {
            get: {
                tags: ['Categories'],
                summary: 'ดึงข้อมูลหมวดหมู่ทั้งหมด (read-only)',
                responses: { '200': { description: 'OK' } }
            }
        },
        '/categories/{id}': {
            get: {
                tags: ['Categories'],
                summary: 'ดึงหมวดหมู่ตาม ID (read-only)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
            }
        },
        // ─── Levels ─────────────────────────────────────────────────────────────────
        '/levels': {
            get: {
                tags: ['Levels'],
                summary: 'ดึงข้อมูลระดับทั้งหมด (read-only)',
                responses: { '200': { description: 'OK' } }
            }
        },
        '/levels/{id}': {
            get: {
                tags: ['Levels'],
                summary: 'ดึงระดับตาม ID (read-only)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
            }
        },
        // ─── Courses ──────────────────────────────────────────────────────────────
        '/courses': {
            get: {
                tags: ['Courses'],
                summary: 'ดึงรายชื่อคอร์สทั้งหมด',
                responses: {
                    200: { description: 'รายชื่อคอร์ส', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } } }
                }
            },
            post: {
                tags: ['Courses'],
                summary: 'สร้างคอร์สใหม่ (เฉพาะครู)',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseInput' } } }
                },
                responses: {
                    200: { description: 'สร้างสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ครบ', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/courses/{id}': {
            get: {
                tags: ['Courses'],
                summary: 'ดึงข้อมูลคอร์สพร้อม lessons ทั้งหมด',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: {
                        description: 'ข้อมูล',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/Course' },
                                        { type: 'object', properties: { lessons: { type: 'array', items: { $ref: '#/components/schemas/Lesson' } } } }
                                    ]
                                }
                            }
                        }
                    },
                    404: { description: 'ไม่พบคอร์ส', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            put: {
                tags: ['Courses'],
                summary: 'แก้ไขคอร์ส (เฉพาะครู)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseInput' } } } },
                responses: {
                    200: { description: 'แก้ไขสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    401: { description: 'Unauthorized' }
                }
            },
            delete: {
                tags: ['Courses'],
                summary: 'ลบคอร์ส (cascade ลบ lessons ด้วย)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        // ─── Lessons ─────────────────────────────────────────────────────────────────
        '/lessons': {
            post: {
                tags: ['Lessons'],
                summary: 'สร้างบทเรียนใหม่',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonInput' } } } },
                responses: {
                    200: { description: 'สร้างสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ครบ', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/lessons/course/{id}': {
            get: {
                tags: ['Lessons'],
                summary: 'ดึงบทเรียนทั้งหมดของ course',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'รายการบทเรียนของ course', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Lesson' } } } } }
                }
            }
        },
        '/lessons/{id}': {
            get: {
                tags: ['Lessons'],
                summary: 'ดึงข้อมูลบทเรียนตาม id',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'ข้อมูลบทเรียน', content: { 'application/json': { schema: { $ref: '#/components/schemas/Lesson' } } } },
                    404: { description: 'ไม่พบบทเรียน', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            },
            put: {
                tags: ['Lessons'],
                summary: 'แก้ไขบทเรียน (เฉพาะครู)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonInput' } } } },
                responses: {
                    200: { description: 'แก้ไขสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    401: { description: 'Unauthorized' }
                }
            },
            delete: {
                tags: ['Lessons'],
                summary: 'ลบบทเรียน (cascade ลบ quiz ด้วย)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        // ─── Enrollments ──────────────────────────────────────────────────────────────
        '/enrollments': {
            post: {
                tags: ['Enrollments'],
                summary: 'ลงทะเบียนเรียน (เฉพาะนักเรียน)',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EnrollmentInput' } } } },
                responses: {
                    200: { description: 'ลงทะเบียนสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ครบ หรือซ้ำ', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/enrollments/course/{course_id}/students': {
            get: {
                tags: ['Enrollments'],
                summary: 'ดึงรายชื่อนักเรียนในคอร์ส (เฉพาะครู)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'course_id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'รายชื่อนักเรียน', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
                }
            }
        },
        '/enrollments/student/{student_id}/courses': {
            get: {
                tags: ['Enrollments'],
                summary: 'ดึงคอร์สที่นักเรียนลงทะเบียน',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'student_id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'รายการคอร์สของนักเรียน', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } } }
                }
            }
        },
        // ─── Quiz ──────────────────────────────────────────────────────────────
        '/quiz': {
            post: {
                tags: ['Quiz'],
                summary: 'สร้างคำถามพร้อมตัวเลือก',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizInput' } } } },
                responses: {
                    200: { description: 'สร้างสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ครบ', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/quiz/lesson/{lesson_id}': {
            get: {
                tags: ['Quiz'],
                summary: 'ดึงคำถามทั้งหมดของบทเรียน (พร้อม choices)',
                parameters: [{ name: 'lesson_id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'รายการ quiz ของ lesson', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Quiz' } } } } },
                    404: { description: 'ไม่พบ quiz', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/quiz/submit': {
            post: {
                tags: ['Quiz'],
                summary: 'ส่งคำตอบ quiz',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizSubmitInput' } } } },
                responses: {
                    200: { description: 'ส่งคำตอบสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'ข้อมูลไม่ถูกต้อง', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                }
            }
        },
        '/quiz/attempts/{quiz_id}': {
            get: {
                tags: ['Quiz'],
                summary: 'ดูผลการทำ quiz ทั้งหมด',
                parameters: [{ name: 'quiz_id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'รายละเอียดการทำ quiz', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/QuizAttemptWithDetail' } } } } }
                }
            }
        },
        '/quiz/{id}': {
            put: {
                tags: ['Quiz'],
                summary: 'แก้ไขคำถาม',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizInput' } } } },
                responses: {
                    200: { description: 'แก้ไขสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }
                }
            },
            delete: {
                tags: ['Quiz'],
                summary: 'ลบคำถาม (cascade ลบ choices)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }
                }
            }
        },
        // ─── Progress ──────────────────────────────────────────────────────────────
        '/progress/complete': {
            post: {
                tags: ['Progress'],
                summary: 'บันทึกความคืบหน้าบทเรียน',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['student_id', 'lesson_id'],
                                properties: {
                                    student_id: { type: 'integer', example: 2 },
                                    lesson_id: { type: 'integer', example: 1 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'บันทึกสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } }
                }
            }
        },
        '/progress/student/{student_id}/course/{course_id}/lessons': {
            get: {
                tags: ['Progress'],
                summary: 'ดูความคืบหน้าแต่ละบทเรียนของนักเรียน',
                parameters: [
                    { name: 'student_id', in: 'path', required: true, schema: { type: 'integer' } },
                    { name: 'course_id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'รายการความคืบหน้า', content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } } }
                }
            }
        },
        '/progress/student/{student_id}/course/{course_id}': {
            get: {
                tags: ['Progress'],
                summary: 'ดูความคืบหน้ารวมของ course',
                parameters: [
                    { name: 'student_id', in: 'path', required: true, schema: { type: 'integer' } },
                    { name: 'course_id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'ความคืบหน้ารวม',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        total_lessons: { type: 'integer', example: 10 },
                                        completed_lessons: { type: 'integer', example: 7 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = spec