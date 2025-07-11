export const BASE_URL = "http://localhost:8000"; // Base URL for the API

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup endpoint
    LOGIN: "/api/auth/login",       // Login endpoint, authenticates user & returns JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },
  RESUME: {
    CREATE: "/api/resume",          // POST - Create a new resume
    GET_ALL: "/api/resume",         // GET - Get all resumes of the logged-in user
    GET_BY_ID: (id) => `/api/resume/${id}`, // GET - Get a specific resume by ID
    UPDATE: (id) => `/api/resume/${id}`,   // PUT - Update a resume by ID
    DELETE: (id) => `/api/resume/${id}`,   // DELETE - Delete a resume by ID
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`, // PUT - Upload Thumbnail and Resume profile images
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // General image upload endpoint (e.g., for profile pictures)
  },
};