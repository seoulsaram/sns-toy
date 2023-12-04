import React from 'react';
import * as ReactDOM from 'react-dom/client';
import socket from 'socket.io-client';

import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { AuthProvider } from './context/AuthContext';
import HttpClient from './network/http';
import TokenStorage from './db/token';
import AuthErrorEventBus from './util/authErrorEventBus';
import SocketClient from './network/socket';

const baseURL = process.env.REACT_APP_BASE_URL ?? '';
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL ?? '', authErrorEventBus);
const tokenStorage = new TokenStorage();
const authService = new AuthService(httpClient, tokenStorage);
const socketClient = new SocketClient(baseURL, () => tokenStorage.getToken());
const tweetService = new TweetService(httpClient, tokenStorage, socketClient);

const socketIO = socket(baseURL);
socketIO.on('connection_error', error => {
	console.error('socket error', error);
});

socketIO.on('tweets', meg => console.log(meg));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
			<App tweetService={tweetService} />
		</AuthProvider>
	</React.StrictMode>,
);
