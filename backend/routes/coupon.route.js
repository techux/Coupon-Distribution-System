const express = require('express');
const rateLimit = require('express-rate-limit'); 

const { auth, restrictTo} = require("../middlewares/auth.middleware");

const {allCoupon, addCoupon, availableCoupon, switchCoupon, updateCoupon, claimCoupon, getCouponClaimHistory} = require("../controllers/coupon.controller");

const router = express.Router();

const claimLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1, // 1 claim per IP per day
    message: {
        status: "error",
        message: 'Coupon already from this IP, Only one coupon is allowed in one Day, please try again after 24 hours.',
    },
  });

router.get("/",             auth, restrictTo(['admin']),allCoupon);
router.post("/claim", claimLimiter, auth, claimCoupon);
router.post("/add",        auth, restrictTo(['admin']), addCoupon);
router.get("/available", availableCoupon);
router.get("/history/:id", auth, restrictTo(['admin']), getCouponClaimHistory);
router.post("/update/:id", auth, restrictTo(['admin']), updateCoupon);
router.post("/switch/:id", auth, restrictTo(['admin']), switchCoupon);

module.exports = router;