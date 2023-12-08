import AuthError from '../types/errors/authError.type';
import AuthErrorEventBus from '../util/authErrorEventBus';

export default class HttpClient {
	private baseURL: string;
	private authErrorEventBus: AuthErrorEventBus;
	constructor(baseURL: string, authErrorEventBus: AuthErrorEventBus) {
		this.baseURL = baseURL;
		this.authErrorEventBus = authErrorEventBus;
	}

	async fetch(url: string, options?: RequestInit) {
		const res = await fetch(`${this.baseURL}${url}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			credentials: 'include', // 쿠키에 있는 정보를 자동으로 포함해서 요청하게 하는 옵션
		});
		let data;

		try {
			data = await res.json();
		} catch (error) {
			console.error('error', error);
		}

		if (res.status > 299 || res.status < 200) {
			const message = data && data.message ? data.message : 'Something went wrong!';
			const error = new AuthError({ name: 'AUTH_ERROR', message, cause: new Error() });

			if (res.status === 401) {
				this.authErrorEventBus.notify(error);
			} else {
				throw new Error(message);
			}
		}
		return data;
	}
}
