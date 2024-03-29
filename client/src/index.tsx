import React from 'react';
import * as ReactDOM from 'react-dom/client';
import socket from 'socket.io-client';
import { ThemeProvider } from '@mui/material';

import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { AuthProvider, fetchCsrfToken, fetchToken } from './context/AuthContext';
import HttpClient from './network/http';
import AuthErrorEventBus from './util/authErrorEventBus';
import SocketClient from './network/socket';
import { theme } from './theme/theme';
import { isMobile } from './util/findAgent';
import ErrorBoundary from './components/ErrorBoundary';

const config = {
	retries: !process.env.REACT_APP_REQUEST_RETRY_COUNT ? 3 : Number(process.env.REACT_APP_REQUEST_RETRY_COUNT),
	initialDelayMs: !process.env.REACT_APP_REQUEST_DELAY_MS ? 5 : Number(process.env.REACT_APP_REQUEST_DELAY_MS),
};

const isWeb = !isMobile();
const baseURL = process.env.REACT_APP_BASE_URL ?? '';
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(
	baseURL ?? '',
	() => fetchCsrfToken(),
	() => fetchToken(),
	isWeb,
	config,
);
const authService = new AuthService(httpClient);
const socketClient = new SocketClient(baseURL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);

const socketIO = socket(baseURL);
socketIO.on('connection_error', error => {
	console.error('socket error', error);
});

socketIO.on('tweets', meg => console.log(meg));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
			<ThemeProvider theme={theme}>
				<ErrorBoundary>
					<App tweetService={tweetService} authService={authService} />
				</ErrorBoundary>
			</ThemeProvider>
		</AuthProvider>
	</React.StrictMode>,
);
