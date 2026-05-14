const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// database
require("./db/db");

// middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/categories", require("./routes/CategoryRoutes.route"));
app.use("/api/products", require("./routes/Products.route"));
app.use("/api/auth",require("./routes/AuthRoutes.route"))
// uploads access
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});