const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


require('dotenv').config();

// Configer Cloudinary

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET // Corrected API secret
});

// multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({storage});


// @route POST /api/upload/
// @desc upload product images to cloudinary
// @access privet

router.post('/' ,upload.array('images', 5), async (req ,res) =>{
    try {
        if(!req.files || req.files.length === 0){ // Check req.files and its length
         return res.status(400).json({message : 'No files to upload'})
        }

        // function to handle the stream upload to cloudinary 
        const streamUpload = (fileBuffer) => {
           return new Promise((resolve , reject) =>{
            // Create an upload stream from Cloudinary
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'ethiovibe_products' }, // Optional: specify a folder in Cloudinary
                (error , result) =>{
                    if(result){
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    } else {
                        reject(error);
                    }
                }
            );
            // Use streamifier to convert file buffer to a readable stream and pipe it to Cloudinary's upload stream
            streamifier.createReadStream(fileBuffer).pipe(stream);
           });
        };

        // Array to store upload results
        const uploadPromises = [];

        // Iterate over each file and push the upload promise to the array
        for (const file of req.files) {
            uploadPromises.push(streamUpload(file.buffer));
        }

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            message: 'Files uploaded successfully',
            files: results // Send back an array of uploaded file details (URL, public_id)
        });
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            message: 'Error uploading files',
            error: error.message || 'Internal server error'
        });
    }
});

module.exports = router;

