import axios from 'axios';

// Base URL: fallback to localhost
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure headers exist
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // You can handle global errors here, e.g., token expiry
      if (error.response.status === 401) {
        console.warn('Unauthorized! Token may have expired.');
        //Optionally, clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getAllUsers: () => api.get('/auth/users'),
};

// --- Post API ---
export const postAPI = {
  getAllPosts: (page = 1, limit = 10, search = '', tag = '', author = '') => api.get(`/posts?page=${page}&limit=${limit}&search=${search}&tag=${tag}&author=${author}`),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
  likeComment: (postId, commentId) => api.put(`/posts/${postId}/comment/${commentId}/like`),
  replyToComment: (postId, commentId, text) => api.post(`/posts/${postId}/comment/${commentId}/reply`, { text }),
};

// --- Community API ---

// --- Community API Extensions ---
export const communityAPI = {
  getAllCommunities: (page = 1, limit = 8, search = '', type = '', userId = '') => api.get(`/communities?page=${page}&limit=${limit}&search=${search}&type=${type}&userId=${userId}`),
  getCommunityById: (id) => api.get(`/communities/${id}`),
  createCommunity: (communityData) => api.post('/communities', communityData),
  updateCommunity: (id, communityData) => api.put(`/communities/${id}`, communityData),
  deleteCommunity: (id) => api.delete(`/communities/${id}`),
  joinCommunity: (id) => api.post(`/communities/${id}/join`),
  leaveCommunity: (id) => api.post(`/communities/${id}/leave`),
  addPostToCommunity: (id, postData) => api.post(`/communities/${id}/posts`, postData),
};
// --- Message API ---
export const messageAPI = {
  sendMessage: (messageData) => api.post('/messages/send', messageData),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  createGroup: (data) => api.post('/messages/group', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessagesByConversation: (conversationId) => api.get(`/messages/conversation/${conversationId}`),
};

// --- Resource API ---
export const resourceAPI = {
  getAllResources: (page = 1, limit = 8, search = '', author = '', savedBy = '') => api.get(`/resources?page=${page}&limit=${limit}&search=${search}&author=${author}&savedBy=${savedBy}`),
  createResource: (data) => api.post('/resources', data),
  getResourceById: (id) => api.get(`/resources/${id}`),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  saveResource: (id) => api.post(`/resources/${id}/save`),
  getUserUploads: () => api.get('/resources/user/uploads'),
  getUserSaved: () => api.get('/resources/user/saved'),
};

export default api;
