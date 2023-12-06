import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config';

export async function connectDB() {
	await mongoose.connect(config.db.host);
}

export const client = new MongoClient(config.db.host, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

// _id를 id로 변환해주는 코드
export function useVirtualId(schema: mongoose.Schema) {
	schema.virtual('id').get(function () {
		//@ts-ignore
		return this._id.toString();
	});
	schema.set('toJSON', { virtuals: true });
	schema.set('toObject', { virtuals: true });
}

export async function connectDBstail() {
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
