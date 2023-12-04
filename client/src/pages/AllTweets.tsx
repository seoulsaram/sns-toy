import React from 'react';
import Tweets from '../components/Tweets';
import TweetService from '../service/tweet';

const AllTweets = ({ tweetService, username }: { tweetService: TweetService; username: string }) => (
	<Tweets tweetService={tweetService} addable username={username} />
);

export default AllTweets;
