import aws from "aws-sdk";

export const s3 = new aws.S3({
  signatureVersion: "v4",
  region: process.env.AWS_S3_REGION,
});
