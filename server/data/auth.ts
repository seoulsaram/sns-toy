import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

export type User = Model & {
	id: string;
	username: string;
	password: string;
	name: string;
	email: string;
	url?: string;
	createdAt: string;
};

export const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			unique: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING(45),
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		url: DataTypes.TEXT,
	},
	{
		timestamps: true,
		updatedAt: false,
	}
);

export async function createUser(user: Omit<User, 'id'>): Promise<number> {
	const res = await User.create(user);
	return res.dataValues.id;
}

export async function findByUsername(username: string): Promise<User | null> {
	const res = (await User.findOne({ where: { username } })) as User | null;
	return res;
}

export async function findById(id: string): Promise<User | null> {
	const res = (await User.findByPk(id)) as User | null;
	return res;
}

export async function update(id: number, url: string): Promise<User | null> {
	const res = (await User.findByPk(id)) as User | null;
	if (!res) {
		throw new Error();
	}
	res.url = url;
	return res.save();
}
