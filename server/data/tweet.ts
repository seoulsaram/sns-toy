import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';
import { sequelize } from '../db/database';
import { User } from './auth';

type TweetType = Model & {
	id: number;
	text: string;
	createdAt: string;
	url?: string;
	username: string;
	name: string;
};

export const Tweet = sequelize.define<TweetType>('tweet', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true,
	},
	text: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

// 관계 정의해줌. 알아서 FK를 만들어준다. 때문에 userId필드를 명시해주지 않음.
Tweet.belongsTo(User);

const INCLUDE_USER: FindOptions = {
	attributes: [
		'id',
		'text',
		'createdAt',
		'userId',
		'updatedAt',
		[Sequelize.col('user.name'), 'name'],
		[Sequelize.col('user.username'), 'username'],
		[Sequelize.col('user.url'), 'url'],
	],
	include: {
		model: User,
		attributes: [],
	},
};

const ORDER_DESC: FindOptions = { order: [['createdAt', 'DESC']] };

export async function getAll(): Promise<TweetType[]> {
	const res: TweetType[] = await Tweet.findAll<TweetType>({
		...INCLUDE_USER,
		...ORDER_DESC,
	});
	return res;
}

export async function getAllByUsername(username: string): Promise<TweetType[]> {
	const res: TweetType[] = await Tweet.findAll<TweetType>({
		...INCLUDE_USER,
		...ORDER_DESC,
		include: {
			model: User,
			attributes: [],
			where: { username },
		},
	});
	return res;
}

export async function getById(id: string): Promise<TweetType | null> {
	const res: TweetType | null = await Tweet.findOne<TweetType>({
		where: { id },
		...INCLUDE_USER,
	});
	return res;
}

export async function create(text: string, userId: string): Promise<TweetType | null> {
	const res = await Tweet.create({ text, userId });
	const created = getById(res.dataValues.id);
	return created;
}

export async function update(id: number, text: string): Promise<TweetType | null> {
	const res = await Tweet.findByPk(id, INCLUDE_USER);
	if (!res) {
		throw new Error();
	}
	res.text = text;
	return res.save();
}

export async function remove(id: number) {
	const res = await Tweet.findByPk(id);
	res?.destroy();
}
