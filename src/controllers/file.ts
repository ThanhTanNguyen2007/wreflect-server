import config from '../config';
import { RequestWithUserInfo } from '../types';
import fs from 'fs';
import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import axios from 'axios';

type Auth0Tokens = {
  access_token: string;
  expires_in: number;
  id_token: string;
  token_type: string;
};
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

    res.send(`${config.SERVER_URL}/uploads/${req?.user?.id}/${req.file.filename}`);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};

export const changeAvatar = async (req: RequestWithUserInfo, res: Response) => {
  try {
    const { sub } = req?.user || {};
    const { picture } = req?.body;

    const bearerToken: { data: Auth0Tokens } = await axios.request({
      method: 'POST',
      url: `${config?.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': ' application/json' },
      data: {
        grant_type: 'client_credentials',
        client_id: '1yULsU7wV7LYiQHhSJK5xW7vJlvu8tD9',
        client_secret: 'W1OeTNWkuK0esIPkX0H8cUQDmWC_KUIDY_1KL1UXkp_Js-DAGrdv2LHuDnxd9ZQL',
        audience: 'https://dev-m0ubghav.us.auth0.com/api/v2/',
      },
    });

    const data = await axios.request({
      method: 'PATCH',
      url: `${config?.AUTH0_DOMAIN}/api/v2/users/${sub}`,
      headers: { authorization: `Bearer ${bearerToken?.data?.access_token}`, 'content-type': 'application/json' },
      data: {
        user_metadata: {
          picture:
            'https://scontent.fsgn13-2.fna.fbcdn.net/v/t1.6435-9/71272235_2174825436151811_6451460647220674560_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=SPFYg4uoiMgAX8SIrZx&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9PXDY8sW6yeOKPNrow1Rqs4pkR1VZta4Dk2D-qfTsBKg&oe=62BFBE1B',
        },
      },
    });
    res.send(data?.data);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
