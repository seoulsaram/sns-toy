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

const tokenRef: React.RefObject<string | undefined> = createRef();
const csrfRef: React.RefObject<string | undefined> = createRef();

type Props = {
	authService: AuthService;
	authErrorEventBus: AuthErrorEventBus;
	children: ReactNode;
};
export function AuthProvider({ authService, authErrorEventBus, children }: Props) {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);

	useImperativeHandle(tokenRef, () => (user ? user?.token : undefined));
	useImperativeHandle(csrfRef, () => csrfToken);

	useEffect(() => {
		authService.csrfToken().then(setCsrfToken).catch(console.error);
	}, [authService]);

	useEffect(() => {
		authErrorEventBus.listen(() => {
			setUser(undefined);
		});
	}, [authErrorEventBus]);

	const signUp = useCallback(
		async (username: string, password: string, name: string, email: string, url?: string) =>
			authService.signup(username, password, name, email, url).then(user => setUser(user)),
		[authService],
	);

	const logIn = useCallback(
		async (username: string, password: string) => authService.login(username, password).then(user => setUser(user)),
		[authService],
	);

	const me = useCallback(() => {
		return authService.me();
	}, [authService]);

	useEffect(() => {
		me().then(setUser).catch(console.error);
	}, [me]);

	const logout = useCallback(async () => authService.logout().then(() => setUser(undefined)), [authService]);

	const context = useMemo(
		() => ({
			user,
			signUp,
			logIn,
			logout,
			me,
		}),
		[user, signUp, logIn, logout, me],
	);

	return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export const fetchToken = () => tokenRef.current;
export const fetchCsrfToken = () => csrfRef.current;
export const useAuth = () => useContext(AuthContext);
