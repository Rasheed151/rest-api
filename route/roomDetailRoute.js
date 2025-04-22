const express = require("express");
const router = express.Router();
const roomDetailController = require("../controllers/roomDetailController");


router.get("/", roomDetailController.getRoomDetails);
router.get("/:id", roomDetailController.getroomDetailById);
router.post("/", roomDetailController.createRoomDetail);
router.put("/", roomDetailController.updateRoomDetail);
router.delete("/", roomDetailController.deleteRoomDetail);

module.exports = router;
