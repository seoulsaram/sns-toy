import TokenStorage from '../db/token';
import HttpClient from '../network/http';

export default class TweetService {
	private http: HttpClient;
	private tokenStorage: TokenStorage;

	constructor(http: HttpClient, tokenStorage: TokenStorage) {
		this.http = http;
		this.tokenStorage = tokenStorage;
	}

	async getTweets(username: string) {
		const query = username ? `?username=${username}` : '';
		return this.http.fetch(`/tweets${query}`, {
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

	async deleteTweet(tweetId: string) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'DELETE',
			headers: this.getHeaders(),
		});
	}

	async updateTweet(tweetId: string, text: string) {
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
}
