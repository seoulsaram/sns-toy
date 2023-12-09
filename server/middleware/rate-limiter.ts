import rateLimit from 'express-rate-limit';
import { config } from '../config';

export default rateLimit({
	windowMs: config.rateLimit.windowMS,
	max: config.rateLimit.max, // IP별 횟수 제한
	message: 'Too many requests',
});
