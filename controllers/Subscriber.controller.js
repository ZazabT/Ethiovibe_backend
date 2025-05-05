const Subscriber = require('../models/Subscriber.model');
// const { validationResult } = require('express-validator');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
    // // Check validation errors
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    // get email from the body 
    const { email } = req.body;

    try {
        // check if the email exists 
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(400).json({ msg: 'This email is already subscribed to our newsletter' });
        }

        // create a new subscriber
        const newSubscriber = new Subscriber({
            email,
            status: 'ACTIVE',
            subscribedAt: new Date()
        });

        await newSubscriber.save();

        res.status(201).json({
            msg: 'Successfully subscribed to our newsletter',
            subscriber: newSubscriber
        });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred while processing your subscription'
        });
    }
};

// Get all subscribers
exports.getAllSubscribers = async (req, res) => {
    try {
        // Get subscribers 
        const subscribers = await Subscriber.find()
            .sort({ subscribedAt: -1 })
        res.status(200).json({
            msg: 'Subscribers fetched successfully',
            subscribers,
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred while fetching subscribers'
        });
    }
};

// // Unsubscribe
// exports.unsubscribe = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const subscriber = await Subscriber.findOne({ email });

//         if (!subscriber) {
//             return res.status(404).json({ msg: 'Subscriber not found' });
//         }

//         subscriber.status = 'UNSUBSCRIBED';
//         subscriber.unsubscribedAt = new Date();
//         await subscriber.save();

//         res.status(200).json({
//             msg: 'Successfully unsubscribed from newsletter',
//             subscriber
//         });
//     } catch (error) {
//         console.error('Unsubscribe error:', error);
//         res.status(500).json({
//             error: 'Server Error',
//             msg: error.message || 'An unexpected error occurred while processing your unsubscription'
//         });
//     }
// };