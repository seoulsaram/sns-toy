import { config } from '../config';
import { Sequelize } from 'sequelize';

const { host, user, database, password, port } = config.db;
export const sequelize = new Sequelize(database, user, password, {
	host,
	port: port,
	dialect: 'mysql',
	// logging: console.log,
});
