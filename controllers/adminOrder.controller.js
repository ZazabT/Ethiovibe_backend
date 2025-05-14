const Order = require('../models/Order.model')


exports.getAllOrders = async ( req , res )=>{

    try {
        // get all orders assecending order
        const orders = await Order.find().populate('user' , 'name email').sort({ createdAt: -1 });
        res.status(200).json({
            msg: 'Orders fetched successfully',
            totalOrders: orders.length,
            orders
        })
    } catch (error) {
        console.error("Admin get Orders error:", error);
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
}

exports.updateOrder = async ( req , res )=>{

    // get order id from req.params
    const { id } = req.params;

    // get data from req.body
    const { deliveryStatus } = req.body;
    // check if order exists
    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            msg: 'Order not found'
        })
    }

    try {
        // update order
        order.deliveryStatus = deliveryStatus;

        // update isDelivered and deliveredAt
        if (deliveryStatus === 'DELIVERED') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        // save order
        await order.save();

        res.status(200).json({
            msg: 'Order status updated successfully',
            order 
        });
    } catch (error) {
        
        console.error("Admin update Order error:", error);
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
}


exports.deleteOrder = async ( req , res )=>{

    // get order id from req.params
    const { id } = req.params;

    // check if order exists
    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            msg: 'Order not found'
        })
    }

    try {
        // delete order
        await order.deleteOne();

        res.status(200).json({
            msg: 'Order deleted successfully',
            order
        });
    } catch (error) {
        console.error("Admin delete Order error:", error);
        res.status(500).json({
            message: 'Error deleting order',
            error: error.message
        });
    }
}