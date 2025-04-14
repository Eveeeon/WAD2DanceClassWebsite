const express = require("express");
const router = express.Router();

const publicRoutes = require("./publicRoutes");
const loginRegisterRoutes = require("./loginRegisterRoutes");
const organiserRoutes = require("./organiserRoutes");
const adminRoutes = require("./adminRoutes");
const { verifyToken, isAuthenticated, requireRole, handleRefreshToken } = require("../middleware/auth");

router.use(handleRefreshToken)
router.use(verifyToken);
router.use((req, res, next) => {
  const user = req.user;
  res.locals.isSignedIn = !!user;
  res.locals.user = user || null;
  res.locals.isAdmin = user?.role === "admin";
  res.locals.isOrganiser = user?.role === "organiser";
  next();
});

// Unsigned users
router.use(publicRoutes);
router.use(loginRegisterRoutes);

router.use(isAuthenticated);

// Organisers -todo
router.use(requireRole("organiser", "admin"));
router.use(organiserRoutes);

// Admin -todo
router.use(requireRole("admin"));
router.use(adminRoutes);

module.exports = router;
