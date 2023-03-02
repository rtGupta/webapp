import express from "express";
import * as productController from "./../controller/product-controller.js";
import * as imageController from "./../controller/image-controller.js";

const router = express.Router();

router.route("/product").post(productController.post);

router.route("/product/:id")
            .get(productController.get)
            .put(productController.updateProduct)
            .delete(productController.deleteProduct)
            .patch(productController.update);

router.route("/product/:id/image")
            .post(imageController.upload.single('fileType'), imageController.uploadImage)
            .get(imageController.getImagesList);

router.route("/product/:id/image/:imageId")
            .delete(imageController.deleteImage);

export default router;
