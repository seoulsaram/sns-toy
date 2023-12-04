export type User = {
	id: string;
	username: string;
	password: string;
	name: string;
	email: string;
	url?: string;
};

let users: User[] = [
	{
		id: '1234',
		username: 'bonbon',
		password: '12345',
		name: 'bonbon',
		email: 'kaste2233@gmail.com',
	},
	{
		id: '1701309260160',
		username: 'Bonbon2',
		password: '$2b$12$/4jDa/kBazoxdP0EnXLs2erPeGqoruTecGhDVp2ZcwLyIGl23EaEy',
		name: '본댕이',
		email: 'kaste2233@gmail.com',
	},
];

export async function createUser(userInfo: Omit<User, 'id'>): Promise<string> {
	const created: User = { ...userInfo, id: Date.now().toString() };
	users.push(created);
	return created.id;
}

export async function findByUsername(username: string): Promise<User | undefined> {
	return users.find(user => user.username === username);
}

export async function findById(id: string): Promise<User | undefined> {
	return users.find(user => user.id === id);
}
