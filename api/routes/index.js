import userRouter from "./user-router.js";
import productRouter from "./product-router.js";

export default (app) => {
  app.get("/healthz", (req, res) => {
    res.status(200).send("Ok");
  });
  app.use("/v1", userRouter);
  app.use("/v1", productRouter);
};
