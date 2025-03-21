const { z } = require("zod");

const getUsersSchema = z
  .object({
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 5))
      .refine((val) => val > 0 && val <= 20, {
        message: "Limit must be between 1 and 20",
      })
      .describe("Number of top users to retrieve"),
  })
  .default({ limit: 5 });

module.exports = {
  getUsersSchema,
};
