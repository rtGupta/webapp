import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve('.env') });

export default {
  ...process.env,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DB,
  username: process.env.USER,
  password: process.env.PASSWORD,
  dialect: process.env.DIALECT,
  regionS3: process.env.AWS_S3_REGION,
  s3bucketName: process.env.S3_BUCKET_NAME
};