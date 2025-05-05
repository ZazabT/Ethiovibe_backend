const Subscriber = require('../models/Subscriber.model');



exports.subscribe = async (req , res) =>{

    // get email from the body 
    const { email } = req.boy;

    try {
        // check if the email exist 

        const existEmail = await Subscriber.find({email});

        if(existEmail){
            return res.status(400).json({message : 'Email already exist'});
        }

        // create a new subscriber

        const newSubscriber = new Subscriber({
            email
        });

        await newSubscriber.save();

        res.status(200).json({msg : 'Successfully subscribed' , subscriber:newSubscriber});
    } catch (error) {
        
    }
}

exports.getAllsubscribers = async (req, res) =>{

}