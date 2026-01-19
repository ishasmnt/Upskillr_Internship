// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // NEW: Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // NEW: Get user stats
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

// ==================== COURSE API ====================
export const courseAPI = {
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.courses) {
        return response.data.courses;
      } else if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  getInstructorCourses: async () => {
    const response = await api.get('/courses/instructor/my-courses');
    return response.data;
  },
};

// ==================== MODULE API ====================
export const moduleAPI = {
  getModules: async (courseId) => {
    const response = await api.get(`/modules/${courseId}`);
    return response.data;
  },

  createModule: async (courseId, moduleData) => {
    const response = await api.post(`/modules/${courseId}`, moduleData);
    return response.data;
  },

  createModuleWithVideo: async (courseId, formData, onUploadProgress) => {
    const response = await api.post(`/modules/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
    });
    return response.data;
  },

  updateModule: async (id, moduleData) => {
    const response = await api.put(`/modules/${id}`, moduleData);
    return response.data;
  },

  deleteModule: async (id) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },

  getVideoStreamUrl: (moduleId) => {
    return `${API_URL}/modules/${moduleId}/stream`;
  },
};

// ==================== ASSIGNMENT API ====================
export const assignmentAPI = {
  getAssignments: async (courseId) => {
    const response = await api.get(`/assignments/${courseId}`);
    return response.data;
  },

  createAssignment: async (courseId, assignmentData) => {
    const response = await api.post(`/assignments/${courseId}`, assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  submitAssignment: async (assignmentId, submission) => {
    const formData = new FormData();
    formData.append('text', submission.text);
    if (submission.file) {
      formData.append('file', submission.file);
    }
    const response = await api.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // NEW: Get my submission for an assignment
  getMySubmission: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data;
  },

  // NEW: Get all submissions for an assignment (Instructor)
  getAssignmentSubmissions: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // NEW: Grade a submission (Instructor)
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
};

// ==================== NOTE API ====================
export const noteAPI = {
  getNotes: async (courseId) => {
    const response = await api.get(`/notes/${courseId}`);
    return response.data;
  },

  createNote: async (courseId, noteData) => {
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('description', noteData.description);
    formData.append('category', noteData.category);
    if (noteData.file) {
      formData.append('file', noteData.file);
    }
    const response = await api.post(`/notes/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  downloadNote: async (id) => {
    const response = await api.get(`/notes/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  previewNote: async (id) => {
    const response = await api.get(`/notes/${id}/preview`);
    return response.data;
  },
};

// ==================== ENROLLMENT API ====================
export const enrollmentAPI = {
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/enrollments/${courseId}`);
    return response.data;
  },

  updateProgress: async (courseId, progressData) => {
    const response = await api.put(`/enrollments/${courseId}/progress`, progressData);
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/progress`);
    return response.data;
  },
};

// ==================== FEEDBACK API ====================
export const feedbackAPI = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback/submit', feedbackData);
    return response.data;
  },

  getCourseFeedback: async (courseId) => {
    const response = await api.get(`/feedback/${courseId}`);
    return response.data;
  },
};

export default api;