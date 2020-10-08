const express = require("express");
const roomController = require("../controllers/roomController");

const router = express.Router();

//GET: http://localhost:3000/
router.get("/", roomController.getHome);

router.get("/:roomId", roomController.getRoom);
module.exports = router;
