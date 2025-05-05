const Order = require('../models/Order.model');





exports.getMyOrder = async (req, res) => {

    try {
        // find all order of the user
        const orders = await Order.find({user : req.user._id}).sort({createdAt : -1});
        res.status(200).json(orders);
    } catch (error) {
        console.error('💥Fetching error:', {
            message: error.message,
            stack: error.stack,
        });

        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}