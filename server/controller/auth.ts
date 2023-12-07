import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User, createUser, findById, findByUsername } from '../data/auth';
import { Request, Response } from 'express';
import { config } from '../config';

export async function signup(req: Request, res: Response) {
	const user: Omit<User, 'id'> = req.body;
	const found = await findByUsername(user.username);
	if (found) {
		return res.status(409).json({ message: `${user.username} already exists` });
	}

	const hashed = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
	const userId = await createUser({ ...user, password: hashed });
	const token = createJwtToken(userId.toString());
	res.status(201).json({ token, username: user.username });
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
	res.status(200).json({ token, username });
}

function createJwtToken(id: string) {
	return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req: Request, res: Response) {
	const user = await findById(req.userId);
	if (!user) return res.status(404).json({ message: 'User not found' });
	res.status(200).json({ token: req.token, username: user.username });
}
