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
	onCardClick: (tweetId: string) => void;
};

const TweetCard = memo(({ tweet, owner, onDelete, onUpdate, onUsernameClick, onCardClick }: Props) => {
	const { id, username, name, url, text, createdAt } = tweet;
	const [editing, setEditing] = useState(false);
	const onClose = () => setEditing(false);

	return (
		<li className="tweet" style={{ cursor: 'pointer' }}>
			<button style={{ background: 'black' }} onClick={() => onCardClick(id)}>
				go to detail
			</button>
			<span className="tweet-container">
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
			</span>
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
