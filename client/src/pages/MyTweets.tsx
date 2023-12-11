import React from 'react';
import Tweets from '../components/Tweets';
import TweetService from '../service/tweet';

const MyTweets = ({ tweetService }: { tweetService: TweetService }) => {
	return <Tweets tweetService={tweetService} addable={false} />;
};

export default MyTweets;
