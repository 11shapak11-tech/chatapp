const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// تسجيل حساب جديد
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "رقم الهاتف مستخدم من قبل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "رقم الهاتف أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رقم الهاتف أو كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: "خطأ في الخادم", error: err.message });
  }
});

module.exports = router;
