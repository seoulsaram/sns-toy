import React, { ChangeEvent, FormEvent, useState } from 'react';

import TweetService from '../service/tweet';
import { TweetType } from '../types/tweet.type';

type Props = {
	tweetService: TweetService;
	// TODO: error type 수정하기
	onError: (error: string) => void;
	onCreated: (tweet: TweetType) => void;
};
const NewTweetForm = ({ tweetService, onError, onCreated }: Props) => {
	const [tweet, setTweet] = useState('');

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		tweetService
			.postTweet(tweet)
			.then(created => {
				setTweet('');
				onCreated(created);
			})
			.catch(onError);
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTweet(event.target.value);
	};

	return (
		<form className="tweet-form" onSubmit={onSubmit}>
			<input
				type="text"
				placeholder="Edit your tweet"
				value={tweet}
				required
				onChange={onChange}
				className="form-input tweet-input"
			/>
			<button type="submit" className="form-btn">
				Post
			</button>
		</form>
	);
};

export default NewTweetForm;
