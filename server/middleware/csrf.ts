import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { config } from '../config';

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
	// 변경하는 요청이 아니므로 그냥 넘어감
	if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
		return next();
	}

	const csrfHeader = req.get('_dwitter-csrf-token');
	if (!csrfHeader) {
		console.warn('Missing required "_dwitter-csrf-token" header.', req.headers.origin);
		return res.status(403).json({ message: 'Failed CSRF check' });
	}
	validateCsrfToken(csrfHeader!)
		.then(valid => {
			if (!valid) {
				console.warn(
					'Value provided in "_dwitter-csrf-token" header does not validate.',
					req.headers.origin,
					csrfHeader
				);
				return res.status(403).json({ message: 'Failed CSRF check' });
			}
			next();
		})
		.catch(error => {
			console.error('error', error);
			return res.status(500).json({ message: 'Something went wrong' });
		});
};

async function validateCsrfToken(csrHeader: string) {
	return bcrypt.compare(config.csrf.plainToken, csrHeader);
}
