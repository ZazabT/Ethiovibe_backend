const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        },
        guestId: {
            type: String,
        },
        products: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem',
            required: true,  
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0, 
        }

    },
    {
        timestamps: true, 
    }

);

module.exports = mongoose.model('Cart', cartSchema);