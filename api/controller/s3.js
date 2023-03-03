import aws from "aws-sdk";
import Config from "../../config/config.js";

export const s3 = new aws.S3({
  signatureVersion: "v4",
  region: Config.regionS3,
});
