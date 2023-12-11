import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AllTweets from './pages/AllTweets';
import MyTweets from './pages/MyTweets';
import { useAuth } from './context/AuthContext';
import TweetService from './service/tweet';
import Login from './pages/Login';
import MyInfo from './pages/MyInfo';
import PageNotFound from './pages/PageNotFound';
import AuthService from './service/auth';
import Information from './pages/Information';

type Props = { tweetService: TweetService; authService: AuthService };

function App({ tweetService, authService }: Props) {
	const { user, logout, signUp, logIn } = useAuth();

	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Header username={user?.username} user={user} logout={logout} />}>
						{!user ? (
							<Route path="" element={<Login onSignUp={signUp} onLogin={logIn} />} />
						) : (
							<>
								<Route path="" element={<AllTweets tweetService={tweetService} />} />
								<Route path="myInfo" element={<MyInfo authService={authService} />} />
								<Route path=":username" element={<MyTweets tweetService={tweetService} />} />
							</>
						)}
						<Route path="info" element={<Information />} />
					</Route>
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
