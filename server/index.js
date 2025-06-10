require("dotenv").config();

const express = require("express");
const { connection } = require("./db/connection");
const { userRoutes } = require("./routes/userRoutes");
const { authRoutes } = require("./routes/authRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

const runServer = async () => {
  try {
    await connection;

    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

runServer();
