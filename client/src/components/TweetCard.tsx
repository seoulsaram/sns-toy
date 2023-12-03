import React, { memo, useState } from 'react';
import parseDate from '../util/date';
import Avatar from './Avatar';
import EditTweetForm from './EditTweetForm';
import { TweetType } from '../types/tweet.type';

type Props = {
	tweet: TweetType;
	owner: boolean;
	onDelete: (tweetId: string) => void;
	onUpdate: (tweetId: string, text: string) => void;
	onUsernameClick: (tweet: TweetType) => void;
};

const TweetCard = memo(({ tweet, owner, onDelete, onUpdate, onUsernameClick }: Props) => {
	const { id, username, name, url, text, createdAt } = tweet;
	const [editing, setEditing] = useState(false);
	const onClose = () => setEditing(false);
	return (
		<li className="tweet">
			<section className="tweet-container">
				<Avatar url={url} name={name} />
				<div className="tweet-body">
					<span className="tweet-name">{name}</span>
					<button className="tweet-username" onClick={() => onUsernameClick(tweet)}>
						@{username}
					</button>
					<span className="tweet-date"> · {parseDate(createdAt)}</span>
					<p>{text}</p>
					{editing && <EditTweetForm tweet={tweet} onUpdate={onUpdate} onClose={onClose} />}
				</div>
			</section>
			{owner && (
				<div className="tweet-action">
					<button className="tweet-action-btn" onClick={() => onDelete(id)}>
						x
					</button>
					<button className="tweet-action-btn" onClick={() => setEditing(true)}>
						✎
					</button>
				</div>
			)}
		</li>
	);
});
export default TweetCard;
