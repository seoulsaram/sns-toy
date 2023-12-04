import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	return res.status(400).json({ message: errors.array()[0].msg });
};
