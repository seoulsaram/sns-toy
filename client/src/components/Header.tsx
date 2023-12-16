import React, { memo } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
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

	const onUserInfo = () => {
		navigate(`/myInfo`);
	};

	const onInformation = () => {
		navigate(`/info`);
	};

	const onLogoClick = () => {
		if (!user) navigate('/login');
		else onAllTweets();
	};

	return (
		<div>
			<header className="header">
				<div className="logo">
					<button onClick={onLogoClick}>
						<img src="./img/logo.png" alt="Our Talk Logo" className="logo-img" />
					</button>
					{!user && (
						<Link to="/login" style={{ textDecoration: 'none' }}>
							<h1 className="header-welcome">Welcome to Our Talk !</h1>
						</Link>
					)}
				</div>
				<div className="user-menu">
					<div className="logo-user-container">
						{username && (
							<button onClick={onUserInfo} className="logo-user" title="change user info">
								@{username}
							</button>
						)}
					</div>
					<nav className="menu">
						{username && (
							<>
								<button onClick={onAllTweets}>All Talks</button>
								<button onClick={onMyTweets}>My Talks</button>
								<button className="menu-item" onClick={onLogout}>
									Logout
								</button>
							</>
						)}
						<button title="information" onClick={onInformation}>
							<img src="./img/info.svg" alt="info" />
						</button>
					</nav>
				</div>
			</header>
			<Outlet />
		</div>
	);
});

export default Header;
