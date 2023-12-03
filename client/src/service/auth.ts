export default class AuthService {
	private username: string = '';
	private token: string = '';
	private password: string = '';
	private name: string = '';
	private email: string = '';
	private url: string | undefined = '';

	async login(username: string, password: string) {
		// Assuming you want to use instance properties like this
		this.username = username;
		this.token = password;
		return {
			username: this.username,
			token: this.token,
		};
	}

	async me() {
		// Assuming you want to use instance properties like this
		// return {
		// 	username: this.username,
		// 	token: this.token,
		// };
		return undefined;
	}

	async logout() {
		// You might perform logout-related tasks here
	}

	async signup(username: string, password: string, name: string, email: string, url?: string) {
		// Assuming you want to use instance properties like this
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.url = url;
		this.token = 'abc1234';
		return {
			username: this.username,
			token: this.token,
		};
	}
}
