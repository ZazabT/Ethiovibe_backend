const mongoose = require('mongoose');

// Create a Mongoose schema for the orderItem model

const orderItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
},
{_id : false}
);

// Create a Mongoose schema for the order model

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],

    streetAddress: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    country: {
        enum: ['Ethiopia', 'Kenya', 'Eritrea', 'Djibouti', 'Somalia', 'Sudan'],
        type: String,
        required: true
    },

    postalCode: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    paidAt: {
        type: Date,
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    paymentDetail: {
        type: mongoose.Schema.Types.Mixed,

    },

    isDelivered: {
        type: Boolean
    },

    deliveredAt: {
        type: Date,
    },
    deliveryStatus: {
        type: String,
        enum: [
            'PENDING',
            'PROCESSING',
            'SHIPPED',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'FAILED_DELIVERY',
            'CANCELLED',
            'RETURNED',
            'REFUNDED'
        ],
        default: 'PENDING'
    }

},
    { timestamps: true }

);




module.exports = mongoose.model('order', orderSchema);