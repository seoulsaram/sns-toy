import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';
import { useAuth } from '../context/AuthContext';
import TweetService from '../service/tweet';
import { TweetType } from '../types/tweet.type';

type Props = {
	tweetService: TweetService;
	addable: boolean;
};

const Tweets = memo(({ tweetService, addable }: Props) => {
	const [tweets, setTweets] = useState<TweetType[]>([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const usernameQuery = useParams();

	const { user } = useAuth();
	useEffect(() => {
		tweetService
			.getTweets(usernameQuery?.username)
			.then(tweets => setTweets([...tweets]))
			.catch(onError);

		const stopSync = tweetService.onSync('create', tweet => {
			onCreated(tweet);
		});
		return () => {
			stopSync();
		};
	}, [tweetService, usernameQuery, user]);

	const onCreated = (tweet: TweetType) => {
		setTweets(tweets => [tweet, ...tweets]);
	};

	const onDelete = (tweetId: number) =>
		tweetService
			.deleteTweet(tweetId)
			.then(() => setTweets(tweets => tweets.filter(tweet => tweet.id !== tweetId)))
			.catch(error => onError(error.toString()));

	const onUpdate = (tweetId: number, text: string) => {
		tweetService
			.updateTweet(tweetId, text)
			.then(updated => setTweets(tweets => tweets.map(item => (item.id === updated.id ? updated : item))))
			.catch(error => onError(error.toString()));
		tweetService.onSync('update', tweet => {
			setTweets(tweets => tweets.map(item => (item.id === tweet.id ? tweet : item)));
		});
	};

	const onUsernameClick = (tweet: TweetType) => navigate(`/${tweet.username}`);

	// TODO: error타입 수정하기
	const onError = (error: string) => {
		setError(error.toString());
		setTimeout(() => {
			setError('');
		}, 3000);
	};

	const onCardClick = (tweetId: number) => {
		tweetService
			.getTweet(tweetId)
			.then(tweet => setTweets([tweet]))
			.catch(onError);
	};

	return (
		<div>
			{addable && <NewTweetForm tweetService={tweetService} onError={onError} onCreated={onCreated} />}
			{error && <Banner text={error} isAlert />}
			{tweets.length === 0 && <p className="tweets-empty">No Talks Yet</p>}
			<ul className="tweets">
				{tweets.map(tweet => (
					<TweetCard
						key={tweet.id}
						tweet={tweet}
						owner={tweet.username === user?.username}
						onDelete={onDelete}
						onUpdate={onUpdate}
						onUsernameClick={onUsernameClick}
						onCardClick={onCardClick}
					/>
				))}
			</ul>
		</div>
	);
});
export default Tweets;
