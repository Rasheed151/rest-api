const express = require("express");
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view'); // Pastikan ada folder views

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import dan gunakan route
const roomRoute = require("./route/roomRoute");
app.use("/rooms", roomRoute);

const userRoute = require("./route/userRoute");
app.use("/users", userRoute);

const roomDetailRoutes = require("./route/roomDetailRoute");
app.use("/room-details", roomDetailRoutes);

const transactionRoutes = require('./route/transactionRoute');
app.use('/transactions', transactionRoutes);

const loginRoutes = require("./route/login");
app.use("/login", loginRoutes);

const userRoutes = require("./route/verify"); // atau path sesuai file route lo
app.use("/verify", userRoutes); // atau: app.use("/api", userRoutes);

const printRoutes = require("./route/print");
app.use("/print", printRoutes);



// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});














// const express = require("express");
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");

// const app = express();
// const port = 3000;

// // Middleware untuk parsing JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Konfigurasi koneksi ke database MySQL
// const db = mysql.createConnection({
//   host: "localhost", // Sesuaikan dengan host MySQL
//   user: "root", // Sesuaikan dengan user MySQL
//   password: "", // Masukkan password MySQL
//   database: "express_api",
// });

// // Cek koneksi database
// db.connect((err) => {
//   if (err) {
//     console.error("Koneksi database gagal:", err);
//   } else {
//     console.log("Terhubung ke database MySQL");
//   }
// });

// // ✅ GET: Ambil semua user atau berdasarkan query parameter ID
// app.get("/users", (req, res) => {
//   const { id } = req.query; // Ambil id dari query parameter

//   let sql = "SELECT * FROM users";
//   let params = [];

//   if (id) {
//     sql += " WHERE id = ?";
//     params.push(id);
//   }

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       res.status(500).json({ message: "Error mengambil data", error: err });
//     } else {
//       res.json(results);
//     }
//   });
// });

// // ✅ GET: Ambil user berdasarkan ID dari URL parameter
// app.get("/users/:id", (req, res) => {
//   const { id } = req.params; // Ambil ID dari URL parameter

//   db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
//     if (err) {
//       res.status(500).json({ message: "Error mengambil data", error: err });
//     } else if (results.length === 0) {
//       res.status(404).json({ message: "User tidak ditemukan" });
//     } else {
//       res.json(results[0]); // Ambil hasil pertama
//     }
//   });
// });

// // ✅ POST: Tambah user baru menggunakan query parameter
// app.post("/users", async (req, res) => {
//   // Ambil data dari body ATAU query
//   const name = req.body.name || req.query.name;
//   const email = req.body.email || req.query.email;
//   const password = req.body.password || req.query.password;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "Name, email, dan password harus diisi!" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     db.query(
//       "INSERT INTO users (name, email, password, level) VALUES (?, ?, ?, ?)",
//       [name, email, hashedPassword, 1],
//       (err, result) => {
//         if (err) {
//           return res.status(500).json({ message: "Gagal menambahkan user", error: err });
//         }
//         res.status(201).json({ message: "User berhasil ditambahkan", id: result.insertId });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ message: "Terjadi kesalahan", error });
//   }
// });



// // ✅ PUT: Update user berdasarkan ID
// app.put("/users", (req, res) => {
//   // Ambil data dari body ATAU query
//   const id = req.body.id || req.query.id;
//   const name = req.body.name || req.query.name;
//   const email = req.body.email || req.query.email;

//   if (!id || !name || !email) {
//     return res.status(400).json({ message: "ID, Name, dan Email harus diisi!" });
//   }

//   db.query(
//     "UPDATE users SET name = ?, email = ? WHERE id = ?",
//     [name, email, id],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Gagal memperbarui user", error: err });
//       } else if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "User tidak ditemukan" });
//       } else {
//         return res.json({ message: "User berhasil diperbarui" });
//       }
//     }
//   );
// });



// // ✅ DELETE: Hapus user berdasarkan ID
// app.delete("/users", (req, res) => {
//   const { id } = req.query; // Ambil ID dari query parameter

//   if (!id) {
//     return res.status(400).json({ message: "ID user harus diberikan" });
//   }

//   db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: "Gagal menghapus user", error: err });
//     } else if (result.affectedRows === 0) {
//       res.status(404).json({ message: "User tidak ditemukan" });
//     } else {
//       res.json({ message: "User berhasil dihapus" });
//     }
//   });
// });


// // Jalankan server
// app.listen(port, () => {
//   console.log(`Server berjalan di http://localhost:${port}`);
// });
