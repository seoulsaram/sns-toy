import React from 'react';
import Tweets from '../components/Tweets';
import TweetService from '../service/tweet';

const AllTweets = ({ tweetService }: { tweetService: TweetService }) => (
	<div>
		<Tweets tweetService={tweetService} addable />
	</div>
);

export default AllTweets;
