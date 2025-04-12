const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-super-secret-key";
const SALT_ROUNDS = 10;

const hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) return res.sendStatus(403);
  next();
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  requireRole,
};
