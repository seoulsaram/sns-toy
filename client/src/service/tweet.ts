import HttpClient from '../network/http';
import SocketClient from '../network/socket';
import { TweetType } from '../types/tweet.type';

export default class TweetService {
	private http: HttpClient;
	private socket: SocketClient;

	constructor(http: HttpClient, socket: SocketClient) {
		this.http = http;
		this.socket = socket;
	}

	async getTweets(username?: string) {
		const query = username ? `?username=${username}` : '';
		return this.http.fetch(`/tweets${query}`, {
			method: 'GET',
		});
	}

	async getTweet(id: number) {
		return this.http.fetch(`/tweets/${id}`, {
			method: 'GET',
		});
	}

	async postTweet(text: string) {
		return this.http.fetch(`/tweets`, {
			method: 'POST',
			body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
		});
	}

	async deleteTweet(tweetId: number) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'DELETE',
		});
	}

	async updateTweet(tweetId: number, text: string) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'PUT',
			body: JSON.stringify({ text }),
		});
	}

	onSync(type: 'create' | 'update', callback: (tweet: TweetType) => void) {
		return this.socket.onSync(`tweets-${type}`, callback);
	}
}
