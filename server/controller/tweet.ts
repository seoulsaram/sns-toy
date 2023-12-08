import { getSocketIO } from '../connection/socket';
import * as tweetRepository from '../data/tweet';
import { Request, Response } from 'express';

export async function getTweets(req: Request, res: Response) {
	const username = req.query?.username as string | undefined;
	const data = await (username ? tweetRepository.getAllByUsername(username) : tweetRepository.getAll());
	res.status(200).json(data.filter(tweet => tweet !== null));
}

export async function getTweet(req: Request, res: Response) {
	const id = req.params?.id;
	const tweet = await tweetRepository.getById(id);
	if (tweet) {
		res.status(200).json(tweet);
	} else {
		res.status(404).json({ message: `Tweet id(${id}) not found` });
	}
}

export async function postTweet(req: Request, res: Response) {
	const { text } = req.body;

	const tweet = await tweetRepository.create(text, req.userId);
	res.status(201).json(tweet);
	getSocketIO().emit('tweets-create', tweet);
}

export async function updateTweet(req: Request, res: Response) {
	try {
		const id = Number(req.params?.id);
		const text = req.body?.text;
		const tweet = await tweetRepository.update(id, text);
		if (!tweet) {
			res.status(404).json({ message: 'Tweet dose not exist.' });
			return;
		}
		tweet.text = text;
		res.status(200).json(tweet);
		getSocketIO().emit('tweets-update', tweet);
	} catch (error) {
		res.status(404).json({ message: 'Tweet dose not exist.' });
	}
}

export async function deleteTweet(req: Request, res: Response) {
	const id = Number(req.params?.id);
	const tweets = await tweetRepository.getAll();
	const isIdValid = tweets.find(t => t?.id === id);
	if (!isIdValid) {
		res.status(404).json({ message: 'No post found' });
	} else {
		await tweetRepository.remove(id);
		res.sendStatus(204);
	}
}
