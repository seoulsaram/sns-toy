import React from 'react';
import { useParams } from 'react-router-dom';
import Tweets from '../components/Tweets';
import TweetService from '../service/tweet';

const MyTweets = ({ tweetService }: { tweetService: TweetService }) => {
	const { username } = useParams();
	return <Tweets tweetService={tweetService} username={username ?? ''} addable={false} />;
};

export default MyTweets;
