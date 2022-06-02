import { RequestWithUserInfo } from './types';
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';

import { auth, user } from './controllers';
import { changeAvatar, uploadFile } from './controllers/file';

// export const uploadImage = uploads.fields([{ name: 'image-file', maxCount: 1 }]);
const apiRouter = (): Router => {
  const storage = multer.diskStorage({
    destination: function (req: RequestWithUserInfo, file, cb) {
      const { id } = req?.user;
      const dir = `./public/uploads/${id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const pathtest = dir;
      cb(null, pathtest);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

  const router = Router();

  router.post('/login', auth.login);
  router.post('/logout', auth.logout);
  router.post('/upload', upload.single('photo'), uploadFile);
  router.post('/changeAvatar', changeAvatar);

  router.post('/resend_verification_email', auth.sendVerificationEmail);

  router.get('/me', user.me);

  return router;
};

export default apiRouter;
