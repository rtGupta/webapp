import express from "express";
import * as userController from "./../controller/user-controller.js";

const router = express.Router();

router.route("/v1/user").post(userController.post);

router.route('/v1/user/:id')
    .get(userController.get)
    .put(userController.update)

export default router;