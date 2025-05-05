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


exports.getOrderDetails = async (req, res) => {
   const {id} = req.params; 

   try {

    // find order by id
    const order = await Order.findById(id).populate('user', 'name email');

    if(!order){
        return res.status(404).json({message : 'Order not found'});
    }
    
    res.status(200).json({msg : 'Order Fetched Successfully', order});
   } catch (error) {
    console.error('💥Fetching error:', {
        message: error.message,
        stack: error.stack,
        context: { id },
    });
    return res.status(500).json({
        error: 'Server Error',
        msg: error.message || 'An unexpected error occurred', 
    });
   }
}