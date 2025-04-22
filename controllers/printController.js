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
      sql += " WHERE t.id = ?";
      params.push(id);
    }
  
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal ambil data transaksi", error: err });
      res.json(results);
    });
  };

  