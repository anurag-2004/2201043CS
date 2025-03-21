const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const { errorHandler } = require("../middleware/errorHandler");

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is running" });
});

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  });
});

router.use(errorHandler);

module.exports = router;
