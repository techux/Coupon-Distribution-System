const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['unclaimed', 'claimed'], 
        default: 'unclaimed' 
    },
    available: {
        type: Boolean,
        default: true
    },
    claimedBy: { 
        type: String,
        default: null 
    }, 
    claimedAt: { 
        type: Date, 
        default: null 
    }
},{
    timestamps: true,
    versionKey: false
})


const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
