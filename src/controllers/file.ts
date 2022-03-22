import config from '../config';
import { RequestWithUserInfo } from '../types';
import fs from 'fs';
import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

// const storage = multer.diskStorage({
//   destination: function (req: RequestWithUserInfo, file, cb) {
//     const { profile } = req.user;
//     const dir = `./public/uploads/${profile?.nickname}`;
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     const pathtest = dir;
//     cb(null, pathtest);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const credentials = new aws.Credentials({
//   secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
//   accessKeyId: config.AWS_ACCESS_KEY_ID,
// });
// const s3 = new aws.S3({
//   credentials,
// });

// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: config.AWS_BUCKET_NAME,
//     acl: 'public-read-write',
//     cacheControl: 'max-age=31536000',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req: RequestWithUserInfo, file, cb) {
//       const { email } = req.user;
//       const fileName = Date.now().toString() + file.originalname;
//       const fullPath = `${name}/${fileName}`;
//       cb(null, fullPath);
//     },
//   }),
// }).single('photo');

export const uploadFile = (req: RequestWithUserInfo & { file: any }, res: Response) => {
  try {
    //     console.log(req.file);
    //     res.send(`${req?.file?.location}`);
    console.log(req.file);
    res.send(`${config.SERVER_URL}/uploads/${req?.user?.id}/${req.file.filename}`);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
