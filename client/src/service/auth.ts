import HttpClient from '../network/http';

export default class AuthService {
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	async signup(username: string, password: string, name: string, email: string, url?: string) {
		const data = await this.http.fetch('/auth/signup', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
				name,
				email,
				url,
			}),
		});
		return data;
	}

	async login(username: string, password: string) {
		const data = await this.http.fetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),
		});
		return data;
	}

	async me() {
		return this.http.fetch('/auth/me', {
			method: 'GET',
		});
	}

	async changeProfile(url: string) {
		return this.http.fetch('/auth/url', {
			method: 'PATCH',
			body: { url },
		});
	}

	async logout() {
		return this.http.fetch('/auth/logout', {
			method: 'POST',
		});
	}

	async csrfToken() {
		const resp = await this.http.fetch('/auth/csrf-token', {
			method: 'GET',
		});
		return resp.csrfToken;
	}
}
