import HttpClient from '../network/http';

export default class TweetService {
	private http: HttpClient;
	constructor(http: HttpClient) {
		this.http = http;
	}

	async getTweets(username: string) {
		const query = username ? `?username=${username}` : '';
		return this.http.fetch(`/tweets${query}`);
	}

	async postTweet(text: string) {
		return this.http.fetch(`/tweets`, {
			method: 'POST',
			body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
		});
	}

	async deleteTweet(tweetId: string) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'DELETE',
		});
	}

	async updateTweet(tweetId: string, text: string) {
		return this.http.fetch(`/tweets/${tweetId}`, {
			method: 'PUT',
			body: JSON.stringify({ text }),
		});
	}
}
