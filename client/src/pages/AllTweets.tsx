import React from 'react';
import Tweets from '../components/Tweets';
import TweetService from '../service/tweet';

// TODO: username 수정
const AllTweets = ({ tweetService }: { tweetService: TweetService }) => (
	<Tweets tweetService={tweetService} addable username="" />
);

export default AllTweets;
