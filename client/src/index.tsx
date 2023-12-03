import React from 'react';
import * as ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { AuthProvider, AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';

const baseURL = process.env.REACT_APP_BASE_URL;
const httpClient = new HttpClient(baseURL ?? '');
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService();
const tweetService = new TweetService(httpClient);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
			<App tweetService={tweetService} />
		</AuthProvider>
	</React.StrictMode>,
);
