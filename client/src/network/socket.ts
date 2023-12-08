import { Socket as SocketIO, io } from 'socket.io-client';
import { TweetType } from '../types/tweet.type';

export default class SocketClient {
	private io: SocketIO;
	constructor(baseURL: string, getAccessToken: () => string | null | undefined) {
		this.io = io(baseURL, {
			auth: cb => cb({ token: getAccessToken() }),
		});

		this.io.on('error', err => {
			console.error('socket error', err.message);
		});
	}

	onSync(event: string, callback: (tweet: TweetType) => void) {
		if (!this.io.connected) {
			this.io.connect();
		}

		this.io.on(event, tweet => callback(tweet));
		return () => this.io.off(event);
	}
}
