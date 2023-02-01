import userRouter from "./user-router.js";

export default (app) => {
  app.get("/healthz", (req, res) => {
    res.status(200).send("Ok");
  });
  app.use("/", userRouter);
};
