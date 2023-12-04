import TokenStorage from '../db/token';
import HttpClient from '../network/http';

export default class AuthService {
	private http: HttpClient;
	private tokenStorage: TokenStorage;

	constructor(http: HttpClient, tokenStorage: TokenStorage) {
		this.http = http;
		this.tokenStorage = tokenStorage;
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
		this.tokenStorage.saveToken(data.token);
		return data;
	}

	async login(username: string, password: string) {
		const data = await this.http.fetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),
		});
		this.tokenStorage.saveToken(data.token);
		return data;
	}

	async me() {
		const token = this.tokenStorage.getToken();
		return this.http.fetch('/auth/me', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	async logout() {
		this.tokenStorage.clearToken();
	}
}
