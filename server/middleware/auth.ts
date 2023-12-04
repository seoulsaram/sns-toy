import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { findById } from '../data/auth';

const AUTH_ERROR = { message: 'Authentication Error' };

// TODO: token 수정
export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');
	if (!(authHeader && authHeader.startsWith('Bearer '))) {
		return res.status(401).json(AUTH_ERROR);
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, 'sdflksdjflksdjfds', async (error: VerifyErrors | null, decoded: any) => {
		if (error) return res.status(401).json(AUTH_ERROR);

		const user = await findById(decoded.id);
		if (!user) return res.status(401).json(AUTH_ERROR);
		req.userId = user.id;
		req.token = token;
		next();
	});
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');
	const token = authHeader?.split(' ')[1] ?? '';

	jwt.verify(token, 'sdflksdjflksdjfds', async (_: VerifyErrors | null, decoded: any) => {
		const reqUserId = req.userId;
		if (decoded.id !== reqUserId) return res.status(403).json(AUTH_ERROR);
		next();
	});
};
