import express from "express";
import * as userController from "./../controller/user-controller.js";

const router = express.Router();

router.route("/user").post(userController.post);

router.route('/user/:id')
    .get(userController.get)
    .put(userController.update)

export default router;