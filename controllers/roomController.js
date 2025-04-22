const db = require("../config/db");

// ✅ Ambil semua room atau berdasarkan id
exports.getRooms = (req, res) => {
  const id = req.query.id || req.body.id;
  let sql = "SELECT * FROM room";

//   let sql = `SELECT *
// FROM room
// LEFT JOIN room_detail
// ON room.type_id = room_detail.id;`;

  let params = [];

  if (id) {
    sql += " WHERE id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data", error: err });
    res.json(results);
  });
};

// ✅ Ambil room berdasarkan ID di URL
exports.getRoomById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM room WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal ambil data", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Room tidak ditemukan" });
    res.json(results[0]);
  });
};

// ✅ Tambah room baru
exports.createRoom = (req, res) => {
  const type_id = req.body.type_id || req.query.type_id;

  if (!type_id || isNaN(type_id)) return res.status(400).json({ message: "Pilih jenis kamar" });

  db.query("INSERT INTO room (type_id, status) VALUES (?, ?)", [type_id, 1], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal tambah room", error: err });
    res.status(201).json({ message: "Room berhasil ditambahkan", id: result.insertId });
  });
};

// ✅ Update room (dari body atau query)
exports.updateRoom = (req, res) => {
  const id = req.body.id || req.query.id;
  const type_id = req.body.type_id || req.query.type_id;
  const status = req.body.status || req.query.status;

  if (!id) return res.status(400).json({ message: "ID harus diisi" });

  const fields = [];
  const values = [];

  if (type_id !== undefined) {
    fields.push("type_id = ?");
    values.push(type_id);
  }

  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Minimal satu data (type_id atau status) harus diisi untuk update" });
  }

  values.push(id);

  const sql = `UPDATE room SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update room", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Room tidak ditemukan" });
    res.json({ message: "Room berhasil diupdate" });
  });
};

// ✅ Hapus room (support query & body)
exports.deleteRoom = (req, res) => {
  const id = req.query.id || req.body.id;

  if (!id) return res.status(400).json({ message: "ID harus diberikan" });

  db.query("DELETE FROM room WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal hapus room", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Room tidak ditemukan" });
    res.json({ message: "Room berhasil dihapus" });
  });
};
