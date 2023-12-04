const TOKEN = 'token';

export default class TokenStorage {
	saveToken(token: string) {
		localStorage.setItem(TOKEN, token);
	}

	getToken() {
		return localStorage.getItem(TOKEN);
	}

	clearToken() {
		localStorage.removeItem(TOKEN);
	}
}
