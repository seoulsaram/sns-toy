import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';

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
			})
			.catch(onError);
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTweet(event.target.value);
	};

	return (
		<form className="tweet-form" onSubmit={onSubmit}>
			<TextField
				type="text"
				fullWidth
				placeholder="Post your talk"
				value={tweet}
				onChange={onChange}
				size="small"
				variant="outlined"
				required
			/>
			<Button variant="contained" type="submit">
				Post
			</Button>
		</form>
	);
};

export default NewTweetForm;
