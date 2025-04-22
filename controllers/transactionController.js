const db = require("../config/db");


exports.getAllTransactions = (req, res) => {
    const id = req.query.id || req.body.id;
  
    let sql = `
      SELECT t.id AS transaction_id, t.user_id, t.payment_status,
             d.id AS detail_id, d.room_id, d.name, d.check_in, d.check_out,
             d.phone_number, d.total_price, d.payment_method
      FROM transaction t
      JOIN transaction_detail d ON t.detail_id = d.id
    `;
    const params = [];
  
    if (id) {
      sql += " WHERE t.user_id = ?";
      params.push(id);
    }
  
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal ambil data transaksi", error: err });
      res.json(results);
    });
  };


  

// ✅ Buat transaksi baru (transaction + transaction_detail)
exports.createTransaction = (req, res) => {
  const get = (key) => req.body[key] || req.query[key];

  const user_id = get("user_id");
  const payment_status = (get("payment_status") || "pending").trim(); // default pending

  const name = get("name");
  const room_id = get("room_id");
  const check_in = get("check_in");
  const check_out = get("check_out");
  const phone_number = get("phone_number");
  const total_price = get("total_price");
  const payment_method = get("payment_method");

  // Validasi dasar
  if (!user_id ||!name || !room_id || !check_in || !check_out || !total_price || !payment_method) {
    return res.status(400).json({ message: "Beberapa data wajib tidak diisi." });
  }

  // Step 1: Simpan ke transaction_detail
  const sqlDetail = `
    INSERT INTO transaction_detail (name, room_id, check_in, check_out, phone_number, total_price, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const detailValues = [name, room_id, check_in, check_out, phone_number, total_price, payment_method];

  db.query(sqlDetail, detailValues, (err1, result1) => {
    if (err1) return res.status(500).json({ message: "Gagal simpan detail transaksi", error: err1 });

    const detail_id = result1.insertId;

    // Step 2: Simpan ke transaction
    const sqlTransaction = `
      INSERT INTO transaction (detail_id, user_id, payment_status)
      VALUES (?, ?, ?)
    `;
    db.query(sqlTransaction, [detail_id, user_id, payment_status], (err2, result2) => {
      if (err2) return res.status(500).json({ message: "Gagal simpan transaksi utama", error: err2 });

      res.status(201).json({
        message: "Transaksi berhasil disimpan",
        transaction_id: result2.insertId,
        detail_id: detail_id
      });
    });
  });
};


exports.updatePaymentStatus = (req, res) => {
    const id = req.body.id || req.query.id;
    const status = req.body.payment_status || req.query.payment_status;
  
    const allowedStatus = ["pending", "paid", "cancelled"];
    if (!id || !status || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "ID dan status valid harus diberikan" });
    }
  
    const sql = "UPDATE transaction SET payment_status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update status", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
  
      res.json({ message: "Status pembayaran berhasil diupdate" });
    });
  };



  exports.deleteTransaction = (req, res) => {
    const id = req.body.id || req.query.id;
  
    if (!id) return res.status(400).json({ message: "ID transaksi wajib diisi" });
  
    // Step 1: Ambil detail_id
    db.query("SELECT detail_id FROM transaction WHERE id = ?", [id], (err1, results1) => {
      if (err1) return res.status(500).json({ message: "Gagal cek transaksi", error: err1 });
      if (results1.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
  
      const detail_id = results1[0].detail_id;
  
      // Step 2: Hapus transaksi
      db.query("DELETE FROM transaction WHERE id = ?", [id], (err2) => {
        if (err2) return res.status(500).json({ message: "Gagal hapus transaksi", error: err2 });
  
        // Step 3: Hapus detail transaksi
        db.query("DELETE FROM transaction_detail WHERE id = ?", [detail_id], (err3) => {
          if (err3) return res.status(500).json({ message: "Gagal hapus detail transaksi", error: err3 });
  
          res.json({ message: "Transaksi dan detail berhasil dihapus" });
        });
      });
    });
  };
  