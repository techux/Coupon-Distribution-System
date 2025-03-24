const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: String, 
        enum: ['unclaimed', 'claimed'], 
        default: 'unclaimed' 
    },
    claimedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null 
    }, 
    claimedAt: { 
        type: Date, 
        default: null 
    },  
})


const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
