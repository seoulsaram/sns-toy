import mongoose, { Schema } from 'mongoose';
import { useVirtualId } from '../db/database';
import { findById } from './auth';

type TweetType = {
	id: string;
	text: string;
	createdAt: Date;
	url?: string;
	username: string;
	name: string;
};

const tweetSchema = new Schema(
	{
		text: { type: String, required: true },
		url: String,
		username: { type: String, required: true },
		name: { type: String, required: true },
	},
	{ timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

export async function getAll(): Promise<TweetType[]> {
	return Tweet.find({}, [], { sort: { createdAt: -1 } });
}

export async function getAllByUsername(username: string): Promise<TweetType[]> {
	return Tweet.find({ username }, [], { sort: { createdAt: -1 } });
}

export async function getById(id: string): Promise<TweetType | null> {
	return Tweet.findById(id);
}

export async function create(text: string, userId: string): Promise<TweetType | null> {
	const user = await findById(userId);
	if (!user) throw new Error('user not found');
	const { username, name, url } = user;
	const tweet = {
		text,
		userId,
		name,
		username,
		url,
	};
	return new Tweet(tweet).save().then();
}

export async function update(id: string, text: string): Promise<TweetType | null> {
	return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false }).then();
}

export async function remove(id: string) {
	return Tweet.findByIdAndDelete(id);
}
