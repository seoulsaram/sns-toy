import React, { memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from '../types/user.type';

type Props = {
	user: User | undefined;
	logout: () => Promise<void>;
	username?: string;
};

const Header = memo(({ username, user, logout }: Props) => {
	const navigate = useNavigate();

	const onAllTweets = () => {
		navigate('/');
	};

	const onMyTweets = () => {
		navigate(`/${user?.username}`);
	};

	const onLogout = () => {
		if (window.confirm('Do you want to log out?')) {
			logout();
			navigate('/');
		}
	};

	return (
		<div>
			<header className="header">
				<div className="logo">
					<img src="./img/logo.png" alt="Our Sns Logo" className="logo-img" />
					<h1 className="logo-name">Our Sns</h1>
					{username && <span className="logo-user">@{username}</span>}
				</div>
				{username && (
					<nav className="menu">
						<button onClick={onAllTweets}>All Tweets</button>
						<button onClick={onMyTweets}>My Tweets</button>
						<button className="menu-item" onClick={onLogout}>
							Logout
						</button>
					</nav>
				)}
			</header>
			<Outlet />
		</div>
	);
});

export default Header;
