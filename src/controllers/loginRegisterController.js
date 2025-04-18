const userDAO = require("@daos/userDAO");
const validator = require("validator");

const {
  hashPassword,
  comparePassword,
  generateTokens,
} = require("@middleware/auth");

const { sendPasswordResetEmail } = require("@middleware/emailHandler");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_RESET_SECRET = process.env.JWT_SECRET;

const renderLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

const renderRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

const renderResetPassword = (req, res) => {
  res.render("reqResetPassword", { title: "Reset Password" });
};

const renderResetPasswordForm = (req, res) => {
  const { token } = req.params;
  res.render("resetPassword", { token });
};

// Validate password
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 12)
    errors.push({ msg: "Must be at least 12 characters" });
  if (!/[A-Za-z]/.test(password)) errors.push({ msg: "Must include a letter" });
  if (!/\d/.test(password)) errors.push({ msg: "Must include a number" });
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push({ msg: "Must include a special character" });
  return errors;
};

// Handle register
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push({ msg: "Name must be at least 2 characters long" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      errors.push({ msg: "Invalid email address" });
    }

    // Password validation
    if (password !== confirmPassword) {
      errors.push({ msg: "Passwords do not match" });
    }
    const passwordErrors = validatePassword(password);
    passwordErrors.forEach((error) => {
      if (typeof error === 'object' && error.msg) {
        errors.push({ msg: error.msg });
      } else {
        errors.push({ msg: String(error) });
      }
    });

    if (errors.length > 0) {
      return res.status(400).render("register", {
        title: "Register",
        errorMessages: errors,
        name,
        email,
      });
    }

    await userDAO.createUser({ name, email, password });
    res.redirect("/login");
  } catch (err) {
    res.status(400).render("register", {
      title: "Register",
      errorMessages: [{ msg: err.message }],
    });
  }
};

// Handle login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userDAO.findByEmail(email);
    if (!user) {
      return res.status(401).render("login", {
        title: "Login",
        errorMessages: [{ msg: "Invalid email or password" }],
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).render("login", {
        title: "Login",
        errorMessages: [{ msg: "Invalid email or password" }],
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Store the access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false, // Need JavaScript access
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", {
      title: "Login",
      errorMessages: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

// Handle logout
const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  // Return JSON response to handle in frontend js (so session is closed and tokens are cleared properly)
  res.json({ success: true, redirectUrl: "/login" });
};

// Send password reset link
const sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userDAO.findByEmail(email);
    if (user) {
      const token = jwt.sign({ userId: user._id }, JWT_RESET_SECRET, {
        expiresIn: "15m",
      });

      const resetUrl = `${process.env.BASE_URL}/resetPassword/${token}`;
      await sendPasswordResetEmail(user, resetUrl);
    }

    res.json({
      success: true,
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error sending reset link" });
  }
};

// Handle password reset
const handleResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const errors = [];

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  errors.push(...validatePassword(password));

  if (errors.length > 0) {
    return res.status(400).render("resetPassword", {
      token,
      title: "Reset Password",
      errorMessages: errors,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_RESET_SECRET);
    const hashed = await hashPassword(password);
    await userDAO.updatePassword(decoded.userId, hashed);
    res.render("login", {
      title: "Login",
      successMessage: "Password successfully reset. Please log in.",
    });
  } catch (err) {
    return res.status(400).render("resetPassword", {
      token: null,
      title: "Reset Password",
      errorMessages: [
        { msg: "Invalid or expired token. Please request a new link." },
      ],
    });
  }
};

module.exports = {
  renderLogin,
  renderRegister,
  renderResetPassword,
  renderResetPasswordForm,
  register,
  login,
  logout,
  sendResetLink,
  handleResetPassword,
};
