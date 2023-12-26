const Product = require('../models/product');

const createProduct = async (req, res) => {
    try {
        const { productCode, productName, productPrice } = req.body;
        const newProduct = await Product.create({
            productCode,
            productName,
            productPrice,
        });

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { productCode, productName, productPrice } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                productCode,
                productName,
                productPrice,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product: updatedProduct });
    } catch (error) {
        console.error('Error creating product:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    fetchProducts,
    createProduct,
    updateProduct,
};