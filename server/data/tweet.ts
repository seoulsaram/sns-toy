import { ObjectId, WithId } from 'mongodb';
import { getTweets } from '../db/database';
import { findById } from './auth';

type TweetType = {
	id: string;
	text: string;
	createdAt: Date;
	url?: string;
	username: string;
	name: string;
};

export async function getAll(): Promise<TweetType[]> {
	const result = await getTweets().find<WithId<TweetType>>({}).sort({ createdAt: -1 }).toArray();
	return mapTweets(result);
}

export async function getAllByUsername(username: string): Promise<TweetType[]> {
	const result = await getTweets().find<WithId<TweetType>>({ username }).sort({ createdAt: -1 }).toArray();
	return mapTweets(result);
}

export async function getById(id: string): Promise<TweetType | null> {
	return getTweets()
		.findOne<WithId<TweetType>>({ _id: new ObjectId(id) })
		.then(mapOptionalTweet);
}

export async function create(text: string, userId: string): Promise<TweetType | null> {
	const user = await findById(userId);
	if (!user) throw new Error('user not found');
	const { username, name, url } = user;
	const tweet = {
		text,
		createdAt: new Date(),
		userId,
		name,
		username,
		url,
	};

	return getTweets()
		.insertOne(tweet)
		.then(data => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

export async function update(id: string, text: string): Promise<TweetType | null> {
	return getTweets()
		.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { text } }, { returnDocument: 'after' })
		.then(data => mapOptionalTweet(data as WithId<TweetType>));
}

export async function remove(id: string) {
	return getTweets().deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalTweet(tweet: (Omit<TweetType, 'id'> & { _id: ObjectId }) | null): TweetType | null {
	if (!tweet) return tweet;
	return { ...tweet, id: tweet._id.toString() };
}

function mapTweets(tweets: (Omit<TweetType, 'id'> & { _id: ObjectId })[]): TweetType[] {
	return tweets.map(mapOptionalTweet).filter(tweet => tweet !== null) as TweetType[];
}
