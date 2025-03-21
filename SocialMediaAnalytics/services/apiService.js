const axios = require("axios");
const { API_BASE_URL, API_TOKEN } = require("../config/env");
const logger = require("../utils/logger");
const { ERROR_MESSAGES } = require("../utils/constants");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

apiClient.interceptors.response.use(
  (response) => {
    logger.debug(`API call successful: ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(
        `API error: ${error.response.status} - ${error.config.url}`,
        {
          data: error.response.data,
        }
      );
    } else if (error.request) {
      logger.error(`API no response: ${error.config.url}`, {
        request: error.request,
      });
    } else {
      logger.error(`API request setup error: ${error.message}`);
    }

    const apiError = new Error(
      error.response?.data?.error || ERROR_MESSAGES.API_ERROR
    );
    apiError.statusCode = error.response?.status || 500;
    apiError.originalError = error;

    return Promise.reject(apiError);
  }
);

const apiService = {
  getUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data.users;
    } catch (error) {
      logger.error("Error in getUsers:", error);
      throw error;
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/posts`);
      return response.data.posts;
    } catch (error) {
      logger.error(`Error in getUserPosts for user ${userId}:`, error);
      throw error;
    }
  },

  getPostComments: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data.comments;
    } catch (error) {
      logger.error(`Error in getPostComments for post ${postId}:`, error);
      throw error;
    }
  },
};

module.exports = apiService;
