const mongoose = require("mongoose");
const Coupon = require("../models/coupon.model");
const getClientIP = require("../utils/getClientIP");

// get all coupon
const allCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        return res.status(200).json({
            status: "ok",
            data: coupons
        });
    } catch (error) {
        console.error(`Error in allCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// get available coupon
const availableCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({ status: 'unclaimed' , available: true }).sort({ _id: 1 });
        return res.status(200).json({
            status: "ok",
            data: coupons
        });
    } catch (error) {
        console.error(`Error in availableCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// add/upload new coupon
const addCoupon = async (req, res) => {
    try {
        const { code, description } = req.body;
        if (!code || !description ) {
            return res.status(400).json({
                status: "error",
                message: "Code or Description not provided to save"
            })
        }

        const exist = await Coupon.findOne({code});

        if(exist) {
            return res.status(400).json({
                status: "error",
                message: "Coupon Code already exist"
            })
        }

        const result = await Coupon.create({
            code,
            description
        })

        return res.status(201).json({
            status: "ok",
            message: "Coupon Code Added Successfully",
            data: result
        })

    } catch (error) {
        console.error(`Error in addCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// modify a coupon
const updateCoupon = async (req, res) => {
    try {
        const { available, status, description } = req.body;
        const couponid = req.params.id ;

        let query = {};
        if (available || !available ) {query.available = available};
        if (status) query.status = status;
        if (description) query.description = description;
        
        const result = await Coupon.findByIdAndUpdate(
            couponid,
            query, 
            { new: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "Coupon Updated Successfully",
            data: result
        })

    } catch (error) {
        console.error(`Error in updateCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// change coupon availibility | Enable/disable certain coupons
const switchCoupon = async (req, res) => {
    try {
        const available = req.body.available?.toLowerCase();
        const id = req.params.id;

        if (!id || !available || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid data passed, Please check the data passed"
            })
        }

        if (!['available', 'unavailable'].includes(available)){
            return res.status(400).json({
                status: "error",
                message: `Invalid value passed, ${available} , Valid is available or unavailable`
            })
        }
        
        let availableStatus ;
        if (available === 'available') {
            availableStatus = true;
        } else {
            availableStatus = false;
        }

        const result = await Coupon.findByIdAndUpdate(
            id,
            { available: availableStatus },
            { new: true }
        )

        return res.status(200).json({
            status: "ok",
            message: "Coupon status updated successfully",
            data: result
        })

    } catch (error) {
        console.error(`Error in switchCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// get coupon claim history
const getCouponClaimHistory = async (req, res) => {
    try {
        const couponid = req.params.id;
        const result = await Coupon.findById(couponid);
        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "Coupon not found"
            })
        }

        return res.status(200).json({
            status: "ok",
            message: "Coupon claim history",
            data: result
        })
                                            
    } catch (error) {
        console.error(`Error in getCouponClaimHistory : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// claim coupon
const claimCoupon = async (req, res) => {
    try {
        const userIp = getClientIP(req);

        const claimedBy = req.user?.email || `IP: ${userIp}`

        console.log(claimedBy);
        
        const { code } = req.body ;

        const coupon = await Coupon.findOne({
            code: code,
            status: "unclaimed",
            available: true
        })

        if (!coupon) {
            return res.status(400).json({
                status: "error",
                message: "Coupon not found or already claimed"
            })
        }

        await Coupon.updateOne(
            { code },
            { 
                $set: {
                    status: "claimed",
                    claimedBy: claimedBy,
                    claimedAt: Date.now()
                } 
            }
        )
        return res.status(200).json({
            status: "ok",
            message: "Coupon claimed successfully",
            coupon: coupon.code
        })

    } catch (error) {
        console.error(`Error in claimCoupon : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}



module.exports = {
    allCoupon,
    addCoupon,
    updateCoupon,
    availableCoupon,
    switchCoupon,
    claimCoupon,
    getCouponClaimHistory
}