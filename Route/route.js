const express = require('express');
const product = require('../Schema/schema')


const router = express.Router();

//Add Products
router.post('/addProduct', async (req, res) => {
    try {
        const { productId, productImage, productName, productPrice } = req.body
        let newProduct = new product({ productId, productImage, productName, productPrice });
        await newProduct.save().then(data => {
            res.status(201).send({ message: 'A new product has been added successfully.', data: data });
        }).catch(error => {
            console.log(error);
            res.status(400).send({ message: "Product was already exists", error: error });
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

//Read Products
router.get('/product', async (req, res) => {
    try {
        await product.find().then(data => {
            res.status(201).send({
                message: "Products have been retrieved successfully.",
                data: data
            })
        }).catch(error => {
            res.status(400).send({ message: "Error while getting a new product", error: error });
        })
    }

    catch (error) {
        res.status(500).send({ message: 'Error while getting a data', error: error })
    }
})

//Read Products By Id
router.get('/readProduct/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        console.log(productId);
        await product.findById({ _id: productId }).then(data => {
            if (!data) {
                return res.status(404).send({ message: 'No product found with the given ID' })
            }
            res.status(201).send({
                message: "Product have been retrieved successfully by ID.",
                data: data
            })
        }).catch(error => {
            console.log(error);
            res.status(400).send({ message: "Error while getting a  product", error: error })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while getting a data',
            error: error
        })
    }
})

//Deleting a Product

router.delete('/deleteProduct/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        await product.findByIdAndDelete({ _id: productId }).then(data => {
            if (!data) {
                return res.status(404).send({ message: 'No product found with the given ID' })
            }
            res.status(201).send({
                message: "Product has been deleted successfully.",
                data: data
            })
        }).catch(error => {
            console.log(error);
            res.status(400).send({ message: "Error while deleting a  product", error: error })
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while getting a data',
            error: error
        })
    }
})

//Edit a Product
router.put('/editProduct/:productId', (req, res) => {
    try {
        const { productId } = req.params;
        product.updateOne({ productId: productId }, { $set: req.body }).then(data => {
            res.status(201).send({
                message: "Product has been update successfully.",
                data: data
            })
        }).catch(error => {
            console.log(error);
            res.status(400).send({ message: "Error while updating a product", error: error })
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while updating a data',
            error: error
        })
    }
})

//get Product
router.get('/getProduct', async (req, res) => {
    try {
        const { productName } = req.body; // Use req.query instead of req.body to retrieve query parameters
        console.log(productName);
        const existingProduct = await product.find({ productName }); // Use uppercase "Product" instead of "product"
        console.log(existingProduct);
        if (existingProduct) { // Check if the existingProduct array has any items
            res.send({
                message: "Products have been retrieved successfully.",
                data: existingProduct
            });
        } else {
            res.send({ message: 'No Product found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error while getting data', error: error }); // Correct the error message
    }
});



module.exports = router;