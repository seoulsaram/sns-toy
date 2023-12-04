import React, {
	ReactNode,
	createContext,
	createRef,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { User } from '../types/user.type';
import AuthService from '../service/auth';
import AuthErrorEventBus from '../util/authErrorEventBus';

export type SignUpType = (
	username: string,
	password: string,
	name: string,
	email: string,
	url?: string,
) => Promise<void>;

export type LoginType = (username: string, password: string) => Promise<void>;

const AuthContext = createContext<{
	user: User | undefined;
	signUp: SignUpType;
	logIn: LoginType;
	logout: () => Promise<void>;
}>({
	user: undefined,
	signUp: (username: string, password: string, name: string, email: string, url?: string) => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	},
	logIn: (username: string, password: string) => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	},
	logout: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	},
});

const contextRef = createRef();

type Props = {
	authService: AuthService;
	authErrorEventBus: AuthErrorEventBus;
	children: ReactNode;
};
export function AuthProvider({ authService, authErrorEventBus, children }: Props) {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [username, setUserName] = useState('');

	useImperativeHandle(contextRef, () => (user ? user?.token : undefined));

	useEffect(() => {
		authErrorEventBus.listen(() => {
			setUser(undefined);
		});
	}, [authErrorEventBus]);

	useEffect(() => {
		authService.me().then(setUser).catch(console.error);
	}, [authService]);

	const signUp = useCallback(
		async (username: string, password: string, name: string, email: string, url?: string) =>
			authService.signup(username, password, name, email, url).then(user => setUser(user)),
		[authService],
	);

	const logIn = useCallback(
		async (username: string, password: string) => authService.login(username, password).then(user => setUser(user)),
		[authService],
	);

	const logout = useCallback(async () => authService.logout().then(() => setUser(undefined)), [authService]);

	const context = useMemo(
		() => ({
			user,
			signUp,
			logIn,
			logout,
		}),
		[user, signUp, logIn, logout],
	);

	return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export const fetchToken = () => contextRef.current;
export const useAuth = () => useContext(AuthContext);
