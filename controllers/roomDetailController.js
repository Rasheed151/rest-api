const db = require("../config/db");

// ✅ Ambil semua room_detail atau berdasarkan ID
exports.getRoomDetails = (req, res) => {
  const id = req.query.id || req.body.id;
  let sql = "SELECT * FROM room_detail";
  let params = [];

  if (id) {
    sql += " WHERE id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data", error: err });

    const parsedResults = results.map(row => ({
      ...row,
      detail: row.detail ? JSON.parse(row.detail) : [] // ✅ convert string ke array
    }));

    res.json(id ? parsedResults[0] : parsedResults);
  });
};

exports.getroomDetailById = (req, res) => {
    const { id } = req.params;
  
    db.query("SELECT * FROM room_detail WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal ambil data", error: err });
      if (results.length === 0) return res.status(404).json({ message: "Room Detail tidak ditemukan" });
  
      const roomDetail = results[0];
      roomDetail.detail = roomDetail.detail ? JSON.parse(roomDetail.detail) : [];
  
      res.json(roomDetail);
    });
  };
  

// ✅ Tambah room_detail baru
exports.createRoomDetail = (req, res) => {
  const type = req.body.type || req.query.type;
  const price = req.body.price || req.query.price;
  const capacity = req.body.capacity || req.query.capacity;
  const bed = req.body.bed || req.query.bed;
  let detail = req.body.detail || req.query.detail;

  if (!type || !price || !capacity || !bed || !detail) {
    return res.status(400).json({ message: "Semua data harus diisi" });
  }

  // ✅ Jika detail berupa string, ubah jadi array dulu
  if (typeof detail === "string") {
    detail = detail.split(",");
  }

  const detailString = JSON.stringify(detail);

  const sql = "INSERT INTO room_detail (type, price, capacity, bed, detail) VALUES (?, ?, ?, ?, ?)";
  const values = [type, price, capacity, bed, detailString];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal tambah room detail", error: err });
    res.status(201).json({ message: "Room detail berhasil ditambahkan", id: result.insertId });
  });
};

// ✅ Update room_detail
exports.updateRoomDetail = (req, res) => {
  const id = req.body.id || req.query.id;
  const type = req.body.type || req.query.type;
  const price = req.body.price || req.query.price;
  const capacity = req.body.capacity || req.query.capacity;
  const bed = req.body.bed || req.query.bed;
  let detail = req.body.detail || req.query.detail;

  if (!id) return res.status(400).json({ message: "ID harus diisi" });

  const fields = [];
  const values = [];

  if (type !== undefined) { fields.push("type = ?"); values.push(type); }
  if (price !== undefined) { fields.push("price = ?"); values.push(price); }
  if (capacity !== undefined) { fields.push("capacity = ?"); values.push(capacity); }
  if (bed !== undefined) { fields.push("bed = ?"); values.push(bed); }
  if (detail !== undefined) {
    if (typeof detail === "string") {
      detail = detail.split(",");
    }
    fields.push("detail = ?");
    values.push(JSON.stringify(detail));
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Minimal satu data harus diisi untuk update" });
  }

  values.push(id);
  const sql = `UPDATE room_detail SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update data", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Room detail berhasil diupdate" });
  });
};

// ✅ Hapus room_detail
exports.deleteRoomDetail = (req, res) => {
  const id = req.query.id || req.body.id;

  if (!id) return res.status(400).json({ message: "ID harus diberikan" });

  db.query("DELETE FROM room_detail WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal hapus data", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Room detail berhasil dihapus" });
  });
};
