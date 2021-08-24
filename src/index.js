// @ts-nocheck
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const connectDB = require("./db/mongoose");
connectDB();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/task", taskRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
