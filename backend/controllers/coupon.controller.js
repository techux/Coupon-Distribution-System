const mongoose = require("mongoose");
const Coupon = require("../models/coupon.model");

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
        const coupons = await Coupon.find({ status: 'unclaimed' }).sort({ _id: 1 });
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
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({
                status: "error",
                message: "Code not provided to save"
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

// claim coupon



module.exports = {
    allCoupon,
    addCoupon,
    availableCoupon,
    switchCoupon
}