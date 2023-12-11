import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { isMobile } from '../util/findAgent';

const defaultRetryConfig = {
	retries: 3,
	initialDelayMs: 100,
};
export default class HttpClient {
	private getCsrfToken: () => string | null | undefined;
	private getAccessToken: () => string | null | undefined;
	private client: AxiosInstance;
	private isWeb: boolean;

	constructor(
		baseURL: string,
		getCsrfToken: () => string | null | undefined,
		getAccessToken: () => string | null | undefined,
		isWeb: boolean,
		config = defaultRetryConfig,
	) {
		this.getCsrfToken = getCsrfToken;
		this.client = axios.create({
			baseURL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		this.client.defaults.withCredentials = true;
		this.getAccessToken = getAccessToken;
		this.isWeb = isWeb;

		axiosRetry(this.client, {
			retries: config.retries,
			retryDelay: retryCount => {
				const delay = 2 ** retryCount * config.initialDelayMs;
				const jitter = delay * 0.1 * Math.random();
				return delay + jitter;
			},
			retryCondition: err => axiosRetry.isNetworkOrIdempotentRequestError(err) || err?.response?.status === 429,
		});
	}

	async fetch(url: string, options?: AxiosRequestConfig & { body?: any }) {
		const request: AxiosRequestConfig = {
			url,
			method: options?.method,
			headers: {
				...options?.headers,
				'dwitter-csrf-token': this.getCsrfToken() ?? '',
			},
			data: options?.body,
		};

		if (!this.isWeb) {
			this.client.defaults.headers.Authorization = `Bearer ${this.getAccessToken()}`;
		}

		try {
			const res = await this.client(request);
			return res.data;
		} catch (err: any) {
			if (err?.response) {
				const data = err.response?.data;
				const message = data && data.message ? data.message : 'Something went wrong!';
				throw new Error(message);
			}
			throw new Error('connection error');
		}
	}
}
