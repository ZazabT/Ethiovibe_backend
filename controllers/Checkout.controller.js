const Order = require('../models/Order.model');
const  Checkout= require('../models/Checkout.model');
const Cart = require('../models/Cart.model');


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
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
};


exports.checkoutPayed = async (req, res) => {
    
    // get data from body
    const { paymentStatus, paymentDetail } = req.body;

    // get checkout id from params 
    const { id } = req.params;

    // check if there is a checkout by id
    const checkout = await Checkout.findById(id);

    if(!checkout){
        return res.status(400).json({ message: 'Checkout not found' });
    }

    try {
        // check if checkout is already payed
        if(paymentStatus === 'paid'){
            checkout.isPaid = true;
            checkout.paidAt = Date.now();
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetail = paymentDetail;
            await checkout.save();
            return res.status(200).json({ msg: 'Checkout is already payed' , checkout});
        }
        else{
            return res.status(400).json({ msg: 'Checkout is not payed' }); 
          }


    } catch (error) {
        console.error('💥 PayCheckout error:', {
            message: error.message,
            stack: error.stack,
            
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}

exports.finalizeCheckout = async (req, res) => {
    
    // get checkout id from params
    const { id } = req.params;

    // check if there is a checkout by id
    const checkout = await Checkout.findById(id);

    if(!checkout){
        return res.status(400).json({ message: 'Checkout not found' });
    }

    try {
      
        // check if checkout is not finalized and payed
        if(!checkout.isFinalized && checkout.isPaid){
            // finalize checkout
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            // create a new order
            const newOrder = new Order({
                orderItems: checkout.checkoutItems,
                user: checkout.user,
                streetAddress: checkout.streetAddress, 
                city: checkout.city,
                country: checkout.country,
                postalCode: checkout.postalCode,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                paymentStatus: checkout.paymentStatus,
                paymentDetail: checkout.paymentDetail,
                isDelivered: false,

            });
            await newOrder.save();

            // delete the carts
            await Cart.findOneAndDelete({ user: checkout.user });
            return res.status(200).json({ msg: 'Checkout is finalized', checkout, newOrder});
        }else if (checkout.isFinalized){
            return res.status(400).json({ msg: 'Checkout is already finalized' }); 
        }else{
            return res.status(400).json({ msg: 'Checkout is not payed' });
          }

    }catch (error) {
        console.error('💥 FinalizeCheckout error:', {
            message: error.message,
            stack: error.stack,
           
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        }); 
    }
}