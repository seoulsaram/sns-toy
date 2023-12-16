import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Button, TextField } from '@mui/material';

import TweetService from '../service/tweet';
import { TweetType } from '../types/tweet.type';
import Painter from './Painter';

type Props = {
	tweetService: TweetService;
	// TODO: error type 수정하기
	onError: (error: string) => void;
};
const NewTweetForm = ({ tweetService, onError }: Props) => {
	const [tweet, setTweet] = useState('');
	const [drawing, setDrawing] = useState('');

	const painterRef = useRef<HTMLCanvasElement | null>(null);
	const [openPainter, setOpenPainter] = useState(false);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		tweetService
			.postTweet(tweet, drawing)
			.then(created => {
				setTweet('');
				setDrawing('');
			})
			.catch(onError);
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTweet(event.target.value);
	};

	const onPaintSave = () => {
		setOpenPainter(false);
		if (painterRef.current) {
			const drawing = painterRef.current.toDataURL();
			setDrawing(drawing);
		}
	};

	const closePainter = () => {
		setDrawing('');
		setOpenPainter(false);
	};

	return (
		<form className="tweet-form" onSubmit={onSubmit} style={{ position: 'relative' }}>
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
			{openPainter && <Painter onPaintSave={onPaintSave} closePainter={closePainter} ref={painterRef} />}
			<Button title="open painter" variant="contained" onClick={() => setOpenPainter(!openPainter)}>
				✦
			</Button>
			<Button variant="contained" type="submit" disabled={openPainter}>
				Post
			</Button>
		</form>
	);
};

export default NewTweetForm;
