import * as http from 'http';
import { Server } from 'socket.io';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { config } from '../config';

let socket: Socket | undefined;
class Socket {
	private static io: Server;
	private constructor(server: http.Server) {
		Socket.io = new Server(server, {
			cors: {
				origin: '*',
			},
		});

		Socket.io.use((socket, next) => {
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error('Authentication error'));
			}
			jwt.verify(
				token,
				config.jwt.secretKey,
				(error: VerifyErrors | null, decoded: string | jwt.JwtPayload['id'] | undefined) => {
					if (error) {
						return next(new Error('Authentication error'));
					}
					next();
				}
			);
		});

		Socket.io.on('connection', socket => {
			console.log('Socket client connected');
		});
	}

	public static getInstance(server: http.Server) {
		return new Socket(server);
	}
	public static getSocketIO() {
		return Socket.io;
	}
}

export function initSocket(server: http.Server) {
	if (!socket) {
		socket = Socket.getInstance(server);
	}
	return socket;
}

export function getSocketIO() {
	if (!socket) {
		throw new Error('Please call init first');
	}
	return Socket.getSocketIO();
}
