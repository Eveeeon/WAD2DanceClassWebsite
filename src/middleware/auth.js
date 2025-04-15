const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const courseDAO = require("@daos/CourseDAO");
const classDAO = require("@daos/ClassDAO");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const generateTokens = (user) => {
  // Access token for signed in user with short expiry
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Refresh token for session management with long expiry
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// Verify access token
const verifyToken = (req, res, next) => {
  // Check headers first (for API requests)
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies) {
    // Only try to access cookies if req.cookies exists
    token = req.cookies.accessToken;
  }

  // No token found
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.warn("Invalid or expired access token:", err.message);
    // Clear the invalid cookie if present
    if (req.cookies && req.cookies.accessToken) {
      res.clearCookie("accessToken");
    }
    return next();
  }
};

// Refresh access token with refresh token cookie
const handleRefreshToken = (req, res, next) => {
  // Skip if we already have a valid user from access token
  if (req.user) return next();

  // Safely check if cookies exist and have refreshToken
  if (!req.cookies || !req.cookies.refreshToken) return next();

  const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    req.user = decoded;

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set new access token in cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  } catch (err) {
    console.warn("Invalid or expired refresh token:", err.message);
    res.clearCookie("refreshToken");
  }

  return next();
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };

const isAuthenticated = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  next();
};

const ensureCourseOrganiser = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const courseId = req.params.id;

    console.log("this is courseId", courseId);
    const course = await courseDAO.findById(courseId);
    console.log("this is course", course);
    if (!course) throw new Error("Course not found");

    if (!(course.organisers || []).includes(userId)) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    next();
  } catch (err) {
    console.error("ensureCourseOrganiser failed:", err.message);
    res.status(err.status || 403).send(err.message || "Forbidden");
  }
};

const ensureClassOrganiser = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const classId = req.params.id;

    const cls = await classDAO.findById(classId);
    if (!cls) throw new Error("Class not found");

    const course = await courseDAO.findById(cls.courseId);
    if (!course) throw new Error("Parent course not found");

    if (!(course.organisers || []).includes(userId)) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    next();
  } catch (err) {
    console.error("ensureClassOrganiser failed:", err.message);
    res.status(err.status || 403).send(err.message || "Forbidden");
  }
};



module.exports = {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyToken,
  requireRole,
  isAuthenticated,
  handleRefreshToken,
  ensureClassOrganiser,
  ensureCourseOrganiser,
};
