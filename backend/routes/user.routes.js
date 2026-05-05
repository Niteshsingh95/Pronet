import express from 'express';
import jwt from "jsonwebtoken";
import { getCurrentUser, getprofile, getSuggestedUser, search, updateProfile } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

let userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);

userRouter.put(
  "/updateprofile",
  isAuth,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateProfile
);

userRouter.get("/profile/:userName", getprofile);
userRouter.get("/search", isAuth, search);
userRouter.get("/suggestedusers", isAuth, getSuggestedUser);

userRouter.get("/go-to-clubs", isAuth, (req, res) => {
  const token = jwt.sign(
    {
      sub: req.user.id,
      email: req.user.email,
      name: `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim(),
      picture: req.user.profileImage || ""
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "5m" }
  );

  res.redirect(`https://pronet-clubs-connect.lovable.app/sso?token=${token}`);
});

export default userRouter;