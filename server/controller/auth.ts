import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User, createUser, findById, findByUsername, update } from '../data/auth';
import { CookieOptions, Request, Response } from 'express';
import { config } from '../config';

export async function signup(req: Request, res: Response) {
	try {
		const user: Omit<User, 'id'> = req.body;
		const found = await findByUsername(user.username);
		if (found) {
			return res.status(409).json({ message: `${user.username} already exists` });
		}

		const hashed = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
		const userId = await createUser({ ...user, password: hashed });
		const token = createJwtToken(userId.toString());
		setToken(res, token);
		res.status(201).json({ token, username: user.username });
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function login(req: Request, res: Response) {
	const ERROR_MESSAGE = { message: 'Invalid user or password' };

	const { username, password } = req.body;
	const user = await findByUsername(username);
	if (!user) {
		return res.status(404).json(ERROR_MESSAGE);
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(404).json(ERROR_MESSAGE);
	}
	const token = createJwtToken(user.id);
	setToken(res, token);
	res.status(200).json({ token, username });
}

export async function logout(req: Request, res: Response) {
	setToken(res, '');
	res.status(200).json({ message: 'User has been logged out' });
}

export async function csrfToken(req: Request, res: Response) {
	const csrfToken = await generateCSRFToken();
	res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
	return bcrypt.hash(config.csrf.plainToken, 1);
}

function createJwtToken(id: string) {
	return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req: Request, res: Response) {
	const user = await findById(req.userId);
	if (!user) return res.status(404).json({ message: 'User not found' });
	res.status(200).json({ token: req.token, username: user.username, url: user.url });
}

export async function updateUrl(req: Request, res: Response) {
	const id = Number(req.userId);
	const url = req.body?.url;
	try {
		const user = await update(id, url);
		res.status(200).json(user);
	} catch (err) {
		res.status(404).json({ message: 'User dose not exist.' });
	}
}

function setToken(res: Response, token: string) {
	const options: CookieOptions = {
		maxAge: config.jwt.expiresInSec * 1000,
		httpOnly: true,
		sameSite: 'none',
		secure: true, // sameSite를 'none'으로 줄 경우 secure: true옵션을 꼭 줘야 한다.
	};
	res.cookie('token', token, options);
}
