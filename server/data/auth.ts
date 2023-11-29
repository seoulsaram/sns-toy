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
		username: 'bonbonbon',
		password: '12345',
		name: 'bonbonbon',
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
