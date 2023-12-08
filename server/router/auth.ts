import express, { NextFunction, RequestHandler, Response } from 'express';
import { body } from 'express-validator';

import * as authController from '../controller/auth';
import { validate } from '../middleware/validator';
import { isAuth } from '../middleware/auth';

const router = express.Router();

const validateCredential = [
	body('username').trim().notEmpty().isLength({ min: 5 }).withMessage('username should be at least 5 characters'),
	body('password').trim().notEmpty().isLength({ min: 5 }).withMessage('password should be at least 5 characters'),
	validate,
];
const validateEmail = body('email').isEmail().withMessage('invalid email');
const validateSignup = [
	...validateCredential,
	validateEmail,
	body('name')
		.notEmpty()
		.trim()
		.matches(/^[가-힣a-zA-Z]*$/),
	body('url').isURL().withMessage('invalid URL').optional({ nullable: true, checkFalsy: true }),
	validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

router.post('/logout', authController.logout);

router.get('/me', isAuth, authController.me);

export default router;
