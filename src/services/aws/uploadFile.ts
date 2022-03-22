import config from '../../config';

const s3Config = {
  bucketName: config.AWS_BUCKET_NAME,
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
};

export const uploadFile = async (file: any) => {
  //   const s3 = new ReactS3Client(s3Config);
  const filename = file.name; /* Optional */
  try {
    // const res = await s3.uploadFile(file, filename);
    // return res;
  } catch (exception) {
    throw exception;
  }
};

export default uploadFile;
