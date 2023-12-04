import { findById } from './auth';

type TweetType = {
	id: string;
	text: string;
	createdAt: string;
	userId: string;
	url?: string;
};

type TweetTypeWithUserInfo = {
	id: string;
	text: string;
	createdAt: string;
	userId: string;
	url?: string;
	username: string;
	name: string;
};

let tweets: TweetType[] = [
	{
		id: '1',
		userId: '1701309260160',
		text: '드림코딩에서 강의 들으면 너무 좋으다',
		createdAt: '2021-05-09T04:20:57.000Z',
		url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
	},
	{
		id: '2',
		text: '꺄아옹',
		userId: '1701309260160',
		createdAt: '2021-05-09T04:20:57.000Z',
		url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
	},
];

export async function getAll() {
	return Promise.all(
		tweets.map(async tweet => {
			const user = await findById(tweet.userId);
			if (!user) return;
			const { username, name, url } = user;
			return { ...tweet, username, name, url };
		})
	);
}

export async function getAllByUsername(username: string) {
	return getAll().then(tweets => tweets.filter(tweet => tweet?.username === username));
}

export async function getById(id: string) {
	return getAll().then(tweets => tweets.find(tweet => tweet?.id === id));
}

export async function create(text: string, userId: string) {
	const tweet = {
		id: Date.now().toString(),
		text,
		createdAt: Date(),
		userId,
	};
	tweets = [tweet, ...tweets];
	return getById(tweet.id);
}

export async function update(id: string, text: string) {
	let tweet = tweets.find(tweet => tweet.id === id);
	if (!tweet) throw new Error();
	tweet.text = text;
	return getById(tweet.id);
}

export async function remove(id: string) {
	tweets = tweets.filter(tweet => tweet.id !== id);
}
