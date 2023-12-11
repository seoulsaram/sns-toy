import { Button, TextField } from '@mui/material';
import React, { ChangeEvent, FormEvent, useLayoutEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthService from '../service/auth';
import Banner from '../components/Banner';
import Avatar from '../components/Avatar';

type Props = { authService: AuthService };
export default function MyInfo({ authService }: Props) {
	const { user } = useAuth();
	const profileUrl = user?.url ?? '';
	const [url, setUrl] = useState('');
	const [error, setError] = useState('');

	useLayoutEffect(() => {
		if (!profileUrl) {
			authService.me().then(userInfo => setUrl(userInfo.url));
		} else {
			setUrl(profileUrl ?? '');
		}
	}, [profileUrl, authService]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		authService.changeProfile(url).catch(error => onError(error.toString()));
	};

	const onError = (error: string) => {
		setError(error.toString());
		setTimeout(() => {
			setError('');
		}, 3000);
	};

	return (
		<>
			{error && <Banner text={error} isAlert />}
			<div className="user-preview">
				{user && <Avatar size={80} url={url} name={user?.username} />}
				<span className="user-name">{user?.username ?? ''}</span>
			</div>

			<form className="tweet-form" onSubmit={onSubmit}>
				<TextField
					type="text"
					fullWidth
					placeholder="Change your profile image url"
					value={url}
					onChange={onChange}
					size="small"
					label="Profile image url"
					variant="outlined"
					required
				/>
				<Button variant="contained" type="submit">
					Save
				</Button>
			</form>
		</>
	);
}
