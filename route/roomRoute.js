const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Routes
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", roomController.createRoom);
router.put("/", roomController.updateRoom);
router.delete("/", roomController.deleteRoom);

module.exports = router;
