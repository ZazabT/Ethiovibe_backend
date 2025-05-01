
const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');
exports.getCart = async (userId, guestId) => {

    if (userId) {
       return await Cart.findOne({ user: userId }); 
    }

    if (guestId) {
        return await Cart.findOne({ guestId });
    }

    return null;
}