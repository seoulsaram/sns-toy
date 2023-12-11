import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { TweetType } from '../types/tweet.type';

type Props = {
	tweet: TweetType;
	onUpdate: (tweetId: number, text: string) => void;
	onClose: () => void;
};

const EditTweetForm = ({ tweet, onUpdate, onClose }: Props) => {
	const [text, setText] = useState(tweet.text);

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		onUpdate(tweet.id, text);
		onClose();
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	return (
		<form className="edit-tweet-form" onSubmit={onSubmit}>
			<TextField
				type="text"
				fullWidth
				placeholder="Edit your talk"
				value={text}
				onChange={onChange}
				size="small"
				variant="outlined"
				required
			/>

			<div className="edit-tweet-form-action">
				<Button variant="contained" size="small" type="submit" className="form-btn-update">
					Update
				</Button>
				<Button variant="contained" size="small" color="secondary" type="button" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default EditTweetForm;
