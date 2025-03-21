const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { PORT } = require("./config/env");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
