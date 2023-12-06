import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config';

export const client = new MongoClient(config.db.host, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export async function connectDB() {
	return client
		.connect()
		.then(db => db)
		.finally(() => {});
}

export function getUsers() {
	return client.db('Dwitter').collection('users');
}

export function getTweets() {
	return client.db('Dwitter').collection('tweets');
}
