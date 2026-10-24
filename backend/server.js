
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

// Test the backend
app.get("/", function (req, res) {
  res.status(200).send("Newsletter backend is running");
});

// Newsletter subscription
app.post("/api/newsletter", async function (req, res) {
  try {
    const email = req.body.email;

    // Check whether email was entered
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please enter your email address."
      });
    }

    const cleanEmail = email.trim();

    // Check the email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    // Check the Brevo configuration
    if (
      !process.env.BREVO_API_KEY ||
      !process.env.BREVO_FROM_EMAIL
    ) {
      return res.status(500).json({
        message: "Email service is not configured."
      });
    }

    // Send the email using Brevo
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: "Newsletter",
            email: process.env.BREVO_FROM_EMAIL
          },
          to: [
            {
              email: cleanEmail
            }
          ],
          subject: "Welcome to our newsletter!",
          htmlContent:
            "<h2>Welcome!</h2><p>Thank you for subscribing to our newsletter.</p>"
        })
      }
    );

    const responseText = await response.text();
    let data = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        data = { message: responseText };
      }
    }

    console.log("Brevo API status:", response.status);

    // Check whether Brevo accepted the request
    if (!response.ok) {
      console.log("Brevo error:", data);

      return res.status(502).json({
        message: "Could not send the email. Please try again."
      });
    }

    console.log("Brevo response:", data);

    return res.status(200).json({
      message: "Your subscription was successful! Check your email."
    });

  } catch (error) {
    console.error("Newsletter error:", error.message);

    return res.status(500).json({
      message: "Something went wrong. Please try again."
    });
  }
});

// Start the backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});
