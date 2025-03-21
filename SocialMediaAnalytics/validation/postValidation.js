const { z } = require("zod");

const getPostsSchema = z.object({
  type: z
    .enum(["latest", "popular"])
    .default("latest")
    .describe("Type of posts to retrieve"),
});

module.exports = {
  getPostsSchema,
};
