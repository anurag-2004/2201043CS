module.exports = {
  ERROR_MESSAGES: {
    INVALID_REQUEST: "Invalid request parameters",
    SERVER_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized access",
    NOT_FOUND: "Resource not found",
    API_ERROR: "Error connecting to external API",
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  ENDPOINTS: {
    USERS: "/users",
    POSTS: "/posts",
    USER_POSTS: (userId) => `/users/${userId}/posts`,
    POST_COMMENTS: (postId) => `/posts/${postId}/comments`,
  },
};
