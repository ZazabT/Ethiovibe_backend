const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');
const Product = require('../models/Product.model');
const { getCart } = require('../helpers/getCart')

// Add a product to the cart
exports.addToCart = async (req, res) => {

    // Get the data from the request body
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        // check if there is a product with the given id
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // check if the user is logged in or guest
        const cart = getCart(userId, guestId);
       // PRIMARY IMAGE
       const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '';
        // if the cart exists update the cart else create a new cart
        if (cart) {
            // check if the product already exists in the cart
            const productInCart = cart.products.find(product => product.productId === productId && product.size === size && product.color === color);

            // if the product already exists in the cart update the quantity
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                // if the product does not exist in the cart add it to the cart
                const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '';
                cart.products.push({
                    productId,
                    price: product.price,
                    name: product.name,
                    image: primaryImage,
                    quantity,
                    size,
                    color
                });
            }

            // recalculate the total price of the cart
            cart.totalPrice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);
            // save the cart
            await cart.save();

            // return the cart
            return res.status(200).json(cart);
        }else {
            // create a new cart
            const newCart = new Cart({
                user: userId ? userId : undefined,
                guestId: guestId? guestId : 'guest_' + new Date().getTime(),
                products: [{
                    productId,
                    price: product.price,
                    name: product.name,
                    image: primaryImage,
                    quantity,
                    size,
                    color
                }],
                totalPrice: product.price * quantity
            });

            // save the cart
            await newCart.save();

            // return the cart
            return res.status(200).json(newCart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error',
            msg: error.message || 'An unexpected error occurred',
        });
    }
}


// Get all products in the cart
exports.getCart = async (req, res) => {

}