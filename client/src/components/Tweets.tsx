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
	username: string;
	addable: boolean;
};

const Tweets = memo(({ tweetService, username, addable }: Props) => {
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

	const onDelete = (tweetId: string) =>
		tweetService
			.deleteTweet(tweetId)
			.then(() => setTweets(tweets => tweets.filter(tweet => tweet.id !== tweetId)))
			.catch(error => setError(error.toString()));

	const onUpdate = (tweetId: string, text: string) => {
		tweetService
			.updateTweet(tweetId, text)
			.then(updated => setTweets(tweets => tweets.map(item => (item.id === updated.id ? updated : item))))
			.catch(error => error.toString());
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

	const onCardClick = (tweetId: string) => {
		tweetService.getTweet(tweetId).then(tweet => setTweets([tweet]));
	};

	return (
		<>
			{addable && <NewTweetForm tweetService={tweetService} onError={onError} onCreated={onCreated} />}
			{error && <Banner text={error} isAlert />}
			{tweets.length === 0 && <p className="tweets-empty">No Tweets Yet</p>}
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
		</>
	);
});
export default Tweets;
