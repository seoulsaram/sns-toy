import { useVirtualId } from '../db/database';
import mongoose, { Schema } from 'mongoose';

export type User = {
	id: string;
	username: string;
	password: string;
	name: string;
	email: string;
	url?: string;
	createdAt: string;
};

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	url: String,
});

useVirtualId(userSchema);
const User = mongoose.model('User', userSchema);

export async function createUser(user: Omit<User, 'id'>): Promise<string> {
	return new User(user).save().then(data => data.id);
}

export async function findByUsername(username: string): Promise<User | null> {
	return User.findOne({ username });
}

export async function findById(id: string): Promise<User | null> {
	return User.findById(id);
}
