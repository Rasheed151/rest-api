const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // Bisa pakai JWT untuk token
const db = require("../config/db"); // pastikan file db-nya sudah benar

router.post("/", (req, res) => {
  const { name, password } = req.body;  // Ambil hanya dari body request

  if (!name || !password) {
    return res.status(400).json({ message: "Name dan password harus diisi!" });
  }

  // Cari user berdasarkan name
  db.query("SELECT * FROM users WHERE name = ?", [name], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan pada server", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = results[0];

    // Cek apakah email sudah diverifikasi
    if (!user.is_verified) {
      return res.status(403).json({ message: "Email belum diverifikasi. Silakan cek inbox kamu." });
    }

    // Cek password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Gagal memverifikasi password", error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Password salah" });
      }

      // Membuat token JWT (jika ingin)
      const token = jwt.sign(
        { id: user.id, name: user.name, level: user.level, email: user.email },
        "secret_key_jwt", // Ganti dengan secret key yang aman
        { expiresIn: "1h" }  // Token kadaluarsa dalam 1 jam
      );

      // Login berhasil
      res.json({
        message: "Login berhasil",
        user: {
          id: user.id,
          name: user.name,
          level: user.level,
          email: user.email
        },
        token: token  // Kirimkan token jika menggunakan JWT
      });
    });
  });
});

module.exports = router;
