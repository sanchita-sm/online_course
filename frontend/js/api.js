const BASE_URL = 'http://localhost:8000'

const axiosConfig = {
  withCredentials: true  // ส่ง session cookie ทุก request
}

const api = {

  users: {
    getAll:      ()         => axios.get(`${BASE_URL}/users`, axiosConfig),
    getById:     (id)       => axios.get(`${BASE_URL}/users/${id}`, axiosConfig),
    update:      (id, data) => axios.put(`${BASE_URL}/users/${id}`, data, axiosConfig),
    remove:      (id)       => axios.delete(`${BASE_URL}/users/${id}`, axiosConfig),
    register:    (data)     => axios.post(`${BASE_URL}/users/register`, data, axiosConfig),
    login:       (data)     => axios.post(`${BASE_URL}/users/login`, data, axiosConfig),
    logout:      ()         => axios.post(`${BASE_URL}/users/logout`, {}, axiosConfig),
  },

  courses: {
    getAll:      ()         => axios.get(`${BASE_URL}/courses`, axiosConfig),
    getById:     (id)       => axios.get(`${BASE_URL}/courses/${id}`, axiosConfig),
    search:      (keyword)  => axios.get(`${BASE_URL}/courses/search?keyword=${encodeURIComponent(keyword)}`, axiosConfig),
    create:      (data)     => axios.post(`${BASE_URL}/courses`, data, axiosConfig),
    update:      (id, data) => axios.put(`${BASE_URL}/courses/${id}`, data, axiosConfig),
    remove:      (id)       => axios.delete(`${BASE_URL}/courses/${id}`, axiosConfig),
  },

  lessons: {
    getByCourse: (courseId) => axios.get(`${BASE_URL}/lessons/course/${courseId}`, axiosConfig),
    getById:     (id)       => axios.get(`${BASE_URL}/lessons/${id}`, axiosConfig),
    create:      (data)     => axios.post(`${BASE_URL}/lessons`, data, axiosConfig),
    update:      (id, data) => axios.put(`${BASE_URL}/lessons/${id}`, data, axiosConfig),
    remove:      (id)       => axios.delete(`${BASE_URL}/lessons/${id}`, axiosConfig),
  },

  quiz: {
    getByLesson: (lessonId) => axios.get(`${BASE_URL}/quiz/lesson/${lessonId}`, axiosConfig),
    create:      (data)     => axios.post(`${BASE_URL}/quiz`, data, axiosConfig),
    update:      (id, data) => axios.put(`${BASE_URL}/quiz/${id}`, data, axiosConfig),
    remove:      (id)       => axios.delete(`${BASE_URL}/quiz/${id}`, axiosConfig),
    submit:      (data)     => axios.post(`${BASE_URL}/quiz/submit`, data, axiosConfig),
    getAttempts: (quizId)   => axios.get(`${BASE_URL}/quiz/attempts/${quizId}`, axiosConfig),
  },

  enrollments: {
    enroll:           (data)      => axios.post(`${BASE_URL}/enrollments`, data, axiosConfig),
    getByStudent:     (studentId) => axios.get(`${BASE_URL}/enrollments/student/${studentId}/courses`, axiosConfig),
    getByCourse:      (courseId)  => axios.get(`${BASE_URL}/enrollments/course/${courseId}/students`, axiosConfig),
  },

  progress: {
    markComplete:    (data)                   => axios.post(`${BASE_URL}/progress/complete`, data, axiosConfig),
    getLessonProgress: (studentId, courseId)  => axios.get(`${BASE_URL}/progress/student/${studentId}/course/${courseId}/lessons`, axiosConfig),
    getCourseProgress: (studentId, courseId)  => axios.get(`${BASE_URL}/progress/student/${studentId}/course/${courseId}`, axiosConfig),
  },

  categories: {
    getAll:  () => axios.get(`${BASE_URL}/categories`, axiosConfig),
    getById: (id) => axios.get(`${BASE_URL}/categories/${id}`, axiosConfig),
  },

  levels: {
    getAll:  () => axios.get(`${BASE_URL}/levels`, axiosConfig),
    getById: (id) => axios.get(`${BASE_URL}/levels/${id}`, axiosConfig),
  },

}