import React, { memo, useRef, useState } from 'react';

import parseDate from '../util/date';
import Avatar from './Avatar';
import EditTweetForm from './EditTweetForm';
import { TweetType } from '../types/tweet.type';

type Props = {
	tweet: TweetType;
	owner: boolean;
	onDelete: (tweetId: number) => void;
	onUpdate: (tweetId: number, text: string) => void;
	onUsernameClick: (tweet: TweetType) => void;
	onCardClick: (tweetId: number) => void;
};

const TweetCard = memo(({ tweet, owner, onDelete, onUpdate, onUsernameClick, onCardClick }: Props) => {
	const { id, username, drawing, name, url, text, createdAt } = tweet;

	const [editing, setEditing] = useState(false);
	const onClose = () => setEditing(false);
	return (
		<li className="tweet" style={{ cursor: 'pointer' }}>
			<span className="tweet-container">
				<Avatar url={url} name={name} />
				<div className="tweet-body">
					<span className="tweet-name">{name}</span>
					<button className="tweet-username" onClick={() => onUsernameClick(tweet)}>
						@{username}
					</button>
					<span className="tweet-date"> · {parseDate(createdAt)}</span>
					<div className="tweet-content">
						{drawing && <img src={drawing} alt="drawing" className="tweet-drawing" />}
						{editing ? (
							<EditTweetForm tweet={tweet} onUpdate={onUpdate} onClose={onClose} />
						) : (
							<button className="tweet-detail-btn" onClick={() => onCardClick(id)}>
								{text}
							</button>
						)}
					</div>
				</div>
			</span>
			{owner && (
				<div className="tweet-action">
					<button title="delete talk" className="tweet-action-btn" onClick={() => onDelete(id)}>
						x
					</button>
					<button title="edit talk" className="tweet-action-btn" onClick={() => setEditing(true)}>
						✎
					</button>
				</div>
			)}
		</li>
	);
});
export default TweetCard;
