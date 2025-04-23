const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "hotel_api",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek DB:", err);
  } else {
    console.log("✅ Terkoneksi ke database MySQL");
  }
});

module.exports = db;
