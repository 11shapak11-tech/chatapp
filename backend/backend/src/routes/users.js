const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// جلب كل المستخدمين (لقائمة جهات الاتصال)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "name phone avatar isOnline lastSeen status"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
});

module.exports = router;
