import { EcoStoreProducts } from "../../models/ecoStore/ecoStoreProducts.js";

export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await EcoStoreProducts.find({});

        return res.status(200)
            .json({
                success: true,
                message: allProducts.length
                    ? `fetched ${allProducts.length} products.`
                    : "No products found.",
                allProducts
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: `Error while fetching all products ${error}`
            })
    }
}

export const getProductDetails = async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400)
            .json({
                success: false,
                message: `No Product id found.`
            })
    }

    try {
        const foundProduct = await EcoStoreProducts.findById(productId)

        if (!foundProduct) {
            return res.status(404)
                .json({
                success: false,
                message: `No Product found.`
                })
        }


        return res.status(200)
            .json({
                success: true,
                message: "Product found.",
                foundProduct
            })

    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: `Error while fetching product details ${error}`
            })
    }
}