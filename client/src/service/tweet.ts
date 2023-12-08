import TokenStorage from '../db/token';
import HttpClient from '../network/http';
import SocketClient from '../network/socket';
import { TweetType } from '../types/tweet.type';

export default class TweetService {
	private http: HttpClient;
	private tokenStorage: TokenStorage;
	private socket: SocketClient;

	constructor(http: HttpClient, tokenStorage: TokenStorage, socket: SocketClient) {
		this.http = http;
		this.tokenStorage = tokenStorage;
		this.socket = socket;
	}

	async getTweets(username?: string) {
		const query = username ? `?username=${username}` : '';
		return this.http.fetch(`/tweets${query}`, {
			method: 'GET',
			headers: this.getHeaders(),
		});
	}

	async getTweet(id: number) {
		return this.http.fetch(`/tweets/${id}`, {
			method: 'GET',
			headers: this.getHeaders(),
		});
	}

	async postTweet(text: string) {
		return this.http.fetch(`/tweets`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
		});
	}

	async deleteTweet(tweetId: number) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'DELETE',
			headers: this.getHeaders(),
		});
	}

	async updateTweet(tweetId: number, text: string) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'PUT',
			headers: this.getHeaders(),
			body: JSON.stringify({ text }),
		});
	}

	getHeaders() {
		const token = this.tokenStorage.getToken();
		return {
			Authorization: `Bearer ${token}`,
		};
	}

	onSync(type: 'create' | 'update', callback: (tweet: TweetType) => void) {
		return this.socket.onSync(`tweets-${type}`, callback);
	}
}
