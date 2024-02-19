import express from 'express';
import userRouter from './authRoute';
import contactRouter from './contactRoute';
import sermonRouter from './sermonRoute';
import eventRouter from './eventRoute';
import commiteRouter from './commiteRoute';
import galleryRouter from './galleryRoute';
import projectRouter from './projectRoute';
import blogRoute from './blogRoute';

const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/cont',contactRouter);
mainRouter.use('/Sermon',sermonRouter);
mainRouter.use('/event',eventRouter);
mainRouter.use('/commite',commiteRouter);
mainRouter.use('/gallery',galleryRouter);
mainRouter.use('/project',projectRouter);
mainRouter.use('/blog',blogRoute);

export  default mainRouter;
