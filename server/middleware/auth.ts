import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { findById } from '../data/auth';
import { config } from '../config';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	// 1. Cookie가 있는지 체크 (for Browser)
	// 2. Header에 있는 Auth 토큰 (for Non-Browser Client)

	let token: string | undefined = getToken(req);

	if (!token) return res.status(401).json(AUTH_ERROR);

	jwt.verify(
		token,
		config.jwt.secretKey,
		async (error: VerifyErrors | null, decoded: string | jwt.JwtPayload['id'] | undefined) => {
			if (error || !decoded) return res.status(401).json(AUTH_ERROR);
			const user = await findById(decoded?.id);
			if (!user) return res.status(401).json(AUTH_ERROR);
			req.userId = user.id;
			req.token = token!;
			next();
		}
	);
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
	let token: string = getToken(req)!;
	console.log('token', token);
	jwt.verify(
		token,
		config.jwt.secretKey,
		async (_: VerifyErrors | null, decoded: string | jwt.JwtPayload['id'] | undefined) => {
			const reqUserId = req.userId;
			if (decoded.id !== reqUserId) return res.status(403).json(AUTH_ERROR);
			next();
		}
	);
};

function getToken(req: Request) {
	const authHeader = req.get('Authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.split(' ')[1];
	}
	return req.cookies['token'];
}
