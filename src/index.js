// @ts-nocheck
const express = require("express");
const app = express();
require("./db/mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());

app.use("/users", userRoutes);
app.use("/task", taskRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
