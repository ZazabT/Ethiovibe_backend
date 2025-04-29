const Product = require('../models/Product.model');
const { validationResult } = require('express-validator');


// Create a new product
exports.createProduct = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const {
        name,
        description,
        price,
        discountPercentage,
        countInStock,
        stockStatus,
        sku,
        sizes,
        colors,
        images,
        gender,
        material,
        isFeatured,
        isDeleted,
        isPublished,
        tags,
        dimensions,
        weight
    } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            discountPercentage,
            countInStock,
            stockStatus,
            sku,
            sizes,
            colors,
            images,
            gender,
            material,
            isFeatured,
            isDeleted,
            isPublished,
            tags,
            dimensions,
            weight,
            user: req.user._id
        });

        await newProduct.save();

        return res.status(201).json({
            msg: 'Product created successfully',
            product: newProduct
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}



// Get all products
exports.getAllProducts = async (req, res) => {

    // get all query
    const {
        collections,
        gender,
        material,
        sizes,
        colors,
        minPrice,
        maxPrice,
        limit,
        sortBy,
        search
    } = req.query;

    // get the query object
    const query = {};

    //Filter logic
    if (collections && collections.toLowerCase() === 'all') {
        query.collections = collections;
    }

    if (gender && gender.toLowerCase() === 'all') {
        query.gender = gender;
    }

    if (material) {
        query.material = { $in: material.split(',') };
    }
    if (sizes) {
        query.sizes = { $in: sizes.split(',') };
    }
    if (colors) {
        query.colors = { $in: colors.split(',') };
    }
    if (minPrice || maxPrice) {
        if (minPrice) {
            query.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            query.price.$lte = Number(maxPrice);
        }
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Sorting logic
    const sortOptions = {};

    if (sortBy) {
        switch (sortBy) {
            case 'price-asc':
                sortOptions.price = 1;
                break;
            case 'price-desc':
                sortOptions.price = -1;
                break;
            case 'name-asc':
                sortOptions.name = 1;
                break;
            case 'name-desc':
                sortOptions.name = -1;
                break;
            case 'createdAt-asc':
                sortOptions.createdAt = 1;
                break;
            case 'createdAt-desc':
                sortOptions.createdAt = -1;
                break;
            case 'price-desc':
                sortOptions.price = -1;
                break;
            case 'price-asc':
                sortOptions.price = 1;
                break;
            case 'popularity-desc':
                sortOptions.popularity = -1;
                break;
            case 'popularity-asc':
                sortOptions.popularity = 1;
                break;

            default:
                break;
        }
    }

    // fetch the producst and limit

    try {
        const products = await Product.find(query)
            .sort(sortOptions)
            .limit(limit || 0);

        return res.status(200).json({
            msg: 'Products fetched successfully',
            products
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Get a single product by ID
exports.getProductById = async (req, res) => {

    // get the product id from params 
    const { id } = req.params;

    // try to get the product if exist
    try {
        // check if product exist
        const product = await Product.findOne(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // return the product with status 200 

        return res.status(200).json({
            msg: 'Product Fetched successfully',
            product
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }

}


// Get similar products by ID
exports.getSimilarProducts = async (req, res) => {

    // get the product id from params
    const { id } = req.params;

    // try to get the product if exist
    try {

        // check if product exist
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // get 4 similar products
        const similarProducts = await Product.find({
            _id: { $ne: product._id }, // Exclude the current product
            gender: product.gender,
            category: product.category,
            material: product.material,
            isDeleted: false,
            isPublished: true,
        }).limit(8);

        return res.status(200).json({
            msg: 'Similar products fetched successfully',
            similarProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Get all deleted products
exports.getBestSellingProducts = async (req, res) => {

    // try to get the best selling product
    try {

        const bestSellingProduct = await Product.findOne().sort({ rating: -1 });
        if (!bestSellingProduct) {
            return res.status(404).json({ error: 'No best selling product found' });
        }
        return res.status(200).json({
            msg: 'Best selling product fetched successfully',
            bestSellingProduct
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}

// Get New Arrivals Products
exports.getNewArrivalsProducts = async (req, res) => {
    // try to get the new arrivals product
    try {
        const newArrivalsProduct = await Product.find().sort({ createdAt:-1 }).limit(8);
        if (!newArrivalsProduct) {
            return res.status(404).json({ error: 'No new arrivals product found' });
        }

        return res.status(200).json({
            msg: 'New arrivals product fetched successfully',
            newArrivalsProduct
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}
// Update a product by ID
exports.updateProduct = async (req, res) => {

    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    // get product id from params
    const { id } = req.params;

    // check if product exists
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // get data from body
    const {
        name,
        description,
        price,
        discountPercentage,
        countInStock,
        stockStatus,
        sku,
        sizes,
        colors,
        images,
        gender,
        material,
        isFeatured,
        isDeleted,
        isPublished,
        tags,
        dimensions,
        weight
    } = req.body;

    // try to update product
    try {
        const updatedProductData = {
            name,
            description,
            price,
            discountPercentage,
            countInStock,
            stockStatus,
            sku,
            sizes,
            colors,
            images,
            gender,
            material,
            isFeatured,
            isDeleted,
            isPublished,
            tags,
            dimensions,
            weight
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

        return res.status(200).json({
            msg: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Delete a product by ID
exports.deleteProduct = async (req, res) => {

    // get product id from param 
    const { id } = req.params;

    // check if the product exist
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // try to soft delete the product 
    try {
        product.isDeleted = true;
        await product.save();

        return res.status(200).json({ message: 'Product marked as deleted successfully', product });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}




