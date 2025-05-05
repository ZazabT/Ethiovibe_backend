const mongoose = require('mongoose');

// Create a Mongoose schema for the CheckoutItem model

const checkoutItemSchema = new mongoose.Schema({
    
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    name : {
        type : String,
        required : true
    },
    size : {
        type : String,
        required : true
     },
     quantity : {
        type : Number,
        required : true
     },
     image : {
        type : String,
        required : true
     },
     price : {
        type : Number,
        required : true
     },
});

// Create a Mongoose schema for the Checkout model

const checkoutSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    checkoutItems : [checkoutItemSchema],

    streetAddress :{
        type : String,
        required : true
    },

    city :{
        type : String,
        required : true
    },

    country :{
        enum : ['Ethiopia','Kenya','Eritrea','Djibouti','Somalia','Sudan'],
        type : String,
        required : true
    },

    postalCode: {
        type : String,
        required : true
    },

    paymentMethod : {
        type : String,
        required : true
    },
    
    totalPrice : {
        type : Number,
        required : true
    },

    isPaid : {
        type : Boolean,
        default : false
    },

    paidAt : {
        type : Date,
    },

    paymentStatus : {
        type : String,
        enum : ['pending','paid','failed'],
        default : 'pending' 
    },

    paymentDetail : {
        type : mongoose.Schema.Types.Mixed,

    },

    isFinalized : {
        type : Boolean
    },

    finalizedAt: {
        type : Date,
    },
},
{timestamps : true}
);




module.exports = mongoose.model('Checkout', checkoutSchema);