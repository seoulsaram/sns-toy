import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AllTweets from './pages/AllTweets';
import MyTweets from './pages/MyTweets';
import { useAuth } from './context/AuthContext';
import TweetService from './service/tweet';
import Login from './pages/Login';

type Props = { tweetService: TweetService };

function App({ tweetService }: Props) {
	const { user, logout, signUp, logIn } = useAuth();
	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Header username={user?.username} user={user} logout={logout} />}>
						{!user ? (
							<Route path="" element={<Login onSignUp={signUp} onLogin={logIn} />} />
						) : (
							<Route path="" element={<AllTweets tweetService={tweetService} username={user?.username ?? ''} />} />
						)}

						<Route path=":username" element={<MyTweets tweetService={tweetService} />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
