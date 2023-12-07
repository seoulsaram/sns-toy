import { FieldPacket, OkPacket } from 'mysql2';
import { db } from '../db/database';
import { findById } from './auth';

type TweetType = {
	id: number;
	text: string;
	createdAt: string;
	url?: string;
	username: string;
	name: string;
};

const SELECT_JOIN =
	'SELECT tw.id, tw.text, tw.createdAt, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id';
const ORDER_DESC = 'ORDER BY tw.createdAt DESC';

export async function getAll(): Promise<TweetType[]> {
	const [data, _] = await db.query(`${SELECT_JOIN} ${ORDER_DESC}`);

	const tweets: TweetType[] = data as TweetType[];
	return tweets;
}

export async function getAllByUsername(username: string): Promise<TweetType[]> {
	const [data, _] = await db.query(`${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`, [username]);
	const tweets: TweetType[] = data as TweetType[];
	return tweets;
}

export async function getById(id: string): Promise<TweetType> {
	const [data, _] = await db.query(`${SELECT_JOIN} WHERE tw.id=? ${ORDER_DESC}`, [id]);
	const tweets: TweetType[] = data as TweetType[];
	return tweets[0];
}

export async function create(text: string, userId: string): Promise<any> {
	const result: [OkPacket, FieldPacket[]] = await db.execute(
		'INSERT INTO tweets (text, createdAt, userId) VALUES(?,?,?)',
		[text, new Date(), userId]
	);
	return getById(result[0].insertId.toString());
}

export async function update(id: string, text: string): Promise<any> {
	await db.execute('UPDATE tweets SET text=? WHERE id=?', [text, id]);
	return getById(id);
}

export async function remove(id: number) {
	const data = await db.execute('DELETE FROM tweets WHERE id=?', [id]);
	return data;
}
