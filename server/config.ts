import dotenv from 'dotenv';

dotenv.config();

type Config = {
	jwt: {
		secretKey: string;
		expiresInSec: number;
	};
	bcrypt: {
		saltRounds: number;
	};
	host: {
		port: number;
	};
	db: {
		host: string;
		user: string;
		database: string;
		password: string;
	};
};

function required(key: string, defaultValue?: number | string) {
	const value = process.env[key] || defaultValue;
	if (!value) {
		throw new Error(`Key ${key} is undefined`);
	}
	return value;
}

export const config: Config = {
	jwt: {
		secretKey: (required('JWT_SECRET') as string) ?? '',
		expiresInSec: Number(required('JWT_EXPIRES_SEC', 86400)),
	},
	bcrypt: {
		saltRounds: Number(required('BCRYPT_SORT_ROUNDS', 12)),
	},
	host: {
		port: Number(required('HOST_PORT', 8080)),
	},
	db: {
		host: required('DB_HOST') as string,
		user: required('DB_USER') as string,
		database: required('DB_PROJECT') as string,
		password: required('DB_PASSWORD') as string,
	},
};
