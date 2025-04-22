const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.getUsers = (req, res) => {
  const { id } = req.query;
  let sql = "SELECT * FROM users";
  let params = [];

  if (id) {
    sql += " WHERE id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(results[0]);
  });
};

exports.createUser = async (req, res) => {
  const name = req.body.name || req.query.name;
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;
  const level = req.body.level || req.query.level || 1;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Lengkapi data" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    db.query(
      "INSERT INTO users (name, email, password, level, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, level, false, verificationToken],
      async (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal tambah user", error: err });

        // Kirim email verifikasi
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ngasalteam05@gmail.com",
            pass: "swik jynf xgxb gpwl", // disarankan pakai App Password
          },
        });

        const verifyUrl = `http://localhost:3000/verify/verify-email?token=${verificationToken}`;
        const mailOptions = {
          from: "ngasalteam05@gmail.com",
          to: email,
          subject: "Verifikasi Email",
          html: `<p>Hai ${name}, klik link berikut untuk verifikasi email kamu:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User berhasil ditambahkan. Cek email untuk verifikasi!" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

exports.updateUser = (req, res) => {
  const { id, name, email } = { ...req.body, ...req.query };
  if (!id || !name || !email)
    return res.status(400).json({ message: "ID, Name, dan Email harus diisi!" });

  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "User berhasil diperbarui" });
  });
};

exports.deleteUser = (req, res) => {
  // Ambil dari query atau body
  const id = req.query.id || req.body.id;

  if (!id) return res.status(400).json({ message: "ID user harus diberikan" });

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal hapus user", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  });
};

exports.verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token tidak ditemukan" });
  }

  console.log("Token dari URL:", token);  // Log token yang datang dari URL

  // Cek token di database hanya sekali
  db.query("SELECT * FROM users WHERE verification_token = ? AND is_verified = 0", [token], (err, results) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err });

    console.log("Hasil pencarian user:", results);  // Log hasil pencarian di database

    if (results.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah digunakan" });
    }

    const userId = results[0].id;

    // Update status verifikasi
    db.query(
      "UPDATE users SET is_verified = ?, verification_token = NULL WHERE id = ?",
      [true, userId],
      (err) => {
        if (err) return res.status(500).json({ message: "Gagal verifikasi", error: err });

        // Kirimkan respon setelah berhasil verifikasi
        res.render("verify");
      }
    );
  });
};
