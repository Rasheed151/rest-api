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


exports.getroomDetailById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM room_detail WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal ambil data", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Room Detail tidak ditemukan" });
    res.json(results[0]);
  });
};