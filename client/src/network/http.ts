export default class HttpClient {
	private baseURL: string;
	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	async fetch(url: string, options?: RequestInit) {
		const res = await fetch(`${this.baseURL}${url}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});
		let data;

		try {
			data = await res.json();
		} catch (error) {
			console.error('error', error);
		}

		if (res.status > 299 || res.status < 200) {
			const message = data && data.message ? data.message : 'Something went wrong!';
			throw new Error(message);
		}
		return data;
	}
}
