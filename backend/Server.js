require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

const indexrouter = require("./Router/index");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors());

// ===== MAIL SETUP =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// ===== MAIL ROUTE =====
app.post("/sendmail", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text: message
    });

    return res.json({
      success: true,
      msg: "Email sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== API ROUTES (IMPORTANT - FIRST) =====
app.use(indexrouter);

// ===== FRONTEND BUILD PATH =====
const buildPath = path.join(__dirname, "../frontend/build");

// Serve static files
app.use(express.static(buildPath));

// ===== FIXED REACT FALLBACK =====
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // 👈 API requests ko skip karo
  }
  res.sendFile(path.join(buildPath, "index.html"));
});

// ===== SERVER START =====
const PORT = 2000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});