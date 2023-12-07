import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config';

export async function connectDB() {
	await mongoose.connect(config.db.host);
}

// _id를 id로 변환해주는 코드
export function useVirtualId(schema: mongoose.Schema) {
	schema.virtual('id').get(function () {
		//@ts-ignore
		return this._id.toString();
	});
	schema.set('toJSON', { virtuals: true });
	schema.set('toObject', { virtuals: true });
}
