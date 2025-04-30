const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    name:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    image:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true, 
        min: 0,
    },
    size:{
        type: String,
        required: true, 
    },
    color:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        default: 1,
    },

},
{
    timestamps: true,  
},
);

module.exports = mongoose.model('CartItem', cartItemSchema);