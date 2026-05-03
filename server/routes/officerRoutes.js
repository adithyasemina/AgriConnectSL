const express = require("express");
const router = express.Router();

const {
  getUnblockedFarmers,
  getBlockedFarmers,
  blockFarmer,
  unblockFarmer,
} = require("../controllers/officerController");

const { protect, officerOnly } = require("../middleware/authMiddleware");

router.get("/farmers/unblocked", protect, officerOnly, getUnblockedFarmers);
router.get("/farmers/blocked", protect, officerOnly, getBlockedFarmers);
router.patch("/farmers/:farmerId/block", protect, officerOnly, blockFarmer);
router.patch(
  "/farmers/:farmerId/unblock",
  protect,
  officerOnly,
  unblockFarmer
);

module.exports = router;
