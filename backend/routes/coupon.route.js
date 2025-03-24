const express = require('express');

const {allCoupon, addCoupon, availableCoupon, switchCoupon} = require("../controllers/coupon.controller");

const router = express.Router();

router.get("/", allCoupon);
router.post("/add", addCoupon);
router.get("/available", availableCoupon);
router.post("/switch/:id", switchCoupon);

module.exports = router;