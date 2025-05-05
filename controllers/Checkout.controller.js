const Order = require('../models/Order.model');
const  Checkout= require('../models/Checkout.model');



exports.createCheckout = async ( req , res) => {
  
    // get data from body 
    const {checkoutItems , streetAddress , city , country , postalCode , paymentMethod , totalPrice } = req.body;

    // check if there is checkoutitems
    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({ message: 'CheckoutItems must be at least 1' });
    }

    try {
        // create a new order
        const newCheckout = new Checkout({
            checkoutItems,
            user: req.user._id,
            streetAddress,
            city,
            country,
            postalCode,
            paymentMethod,
            totalPrice,

        })
    } catch (error) {
        console.error('💥 Creating Checkout error:', {
            message: error.message,
            stack: error.stack,
            context: { productId, userId, guestId }
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};


exports.checkoutPayed = async (req, res) => {
    
}

exports.finalizeCheckout = async (req, res) => {
    
}