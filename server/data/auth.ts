import { FieldPacket, OkPacket } from 'mysql2';
import { db } from '../db/database';

export type User = {
	id: string;
	username: string;
	password: string;
	name: string;
	email: string;
	url?: string;
};

export async function createUser(user: Omit<User, 'id'>): Promise<number> {
	const { username, password, name, email, url } = user;
	const result: [OkPacket, FieldPacket[]] = await db.execute(
		'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
		[username, password, name, email, url ?? null]
	);

	return result[0].insertId;
}

export async function findByUsername(username: string): Promise<User> {
	const [data, _] = await db.query('SELECT * FROM users WHERE username=?', [username]);
	const userData: User[] = data as User[];
	return userData?.[0] || [];
}

export async function findById(id: string): Promise<User> {
	const [data, _] = await db.query('SELECT * FROM users WHERE id=?', [id]);
	const userData: User[] = data as User[];
	return userData?.[0] || [];
}
