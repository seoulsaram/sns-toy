import AuthError from '../types/errors/authError.type';

export default class AuthErrorEventBus {
	private callback = (error?: AuthError) => {};

	listen(callback: typeof this.callback) {
		this.callback = callback;
	}

	notify(error: AuthError) {
		this.callback(error);
	}
}
