import React from 'react';
import * as ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { AuthProvider } from './context/AuthContext';
import HttpClient from './network/http';
import TokenStorage from './db/token';
import AuthErrorEventBus from './util/authErrorEventBus';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL ?? '', authErrorEventBus);
const tokenStorage = new TokenStorage();
const authService = new AuthService(httpClient, tokenStorage);
const tweetService = new TweetService(httpClient, tokenStorage);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
			<App tweetService={tweetService} />
		</AuthProvider>
	</React.StrictMode>,
);
