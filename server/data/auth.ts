import { getUsers } from '../db/database';
import { WithId, ObjectId } from 'mongodb';
export type User = {
	id: string;
	username: string;
	password: string;
	name: string;
	email: string;
	url?: string;
};

export async function createUser(user: Omit<User, 'id'>): Promise<string> {
	const { username, password, name, email, url } = user;
	return getUsers()
		.insertOne({
			username,
			password,
			name,
			email,
			url: url ?? null,
		})
		.then(result => result.insertedId.toString());
}

export async function findByUsername(username: string): Promise<User | null> {
	return getUsers().findOne<WithId<User>>({ username }).then(mapOptionalUser);
}

export async function findById(id: string): Promise<User | null> {
	return getUsers()
		.findOne<WithId<User>>({ _id: new ObjectId(id) })
		.then(mapOptionalUser);
}

function mapOptionalUser(user: WithId<User> | null) {
	if (!user) return user;
	const { username, name, url, email, _id, password } = user;
	return {
		id: _id.toString(),
		username,
		name,
		url,
		email,
		password,
	};
}
