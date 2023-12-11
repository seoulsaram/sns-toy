import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import Banner from '../components/Banner';
import { LoginType, SignUpType } from '../context/AuthContext';

const Login = ({ onSignUp, onLogin }: { onSignUp: SignUpType; onLogin: LoginType }) => {
	const navigate = useNavigate();
	const [signup, setSignup] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [url, setURL] = useState('');
	const [text, setText] = useState('');
	const [isAlert, setIsAlert] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (signup) {
			setDisabled(true);
			onSignUp(username, password, name, email, url)
				.then(() => setDisabled(false))
				.catch(setError);
		} else {
			onLogin(username, password)
				.then(() => navigate('/'))
				.catch(setError);
		}
	};

	// TODO: error타입 수정
	const setError = (error: string) => {
		setText(error.toString());
		setIsAlert(true);
		setDisabled(false);
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value, checked },
		} = event;
		switch (name) {
			case 'username':
				return setUsername(value);
			case 'password':
				return setPassword(value);
			case 'name':
				return setName(value);
			case 'email':
				return setEmail(value);
			case 'url':
				return setURL(value);
			case 'signup':
				return setSignup(checked);
			default:
				return undefined;
		}
	};

	return (
		<>
			<Banner text={text} isAlert={isAlert} />
			<form className="auth-form" onSubmit={onSubmit}>
				<TextField
					name="username"
					type="text"
					placeholder="Id"
					value={username}
					onChange={onChange}
					label="Id"
					variant="outlined"
					required
				/>
				<TextField
					name="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={onChange}
					label="Password"
					variant="outlined"
				/>

				{signup && (
					<TextField
						name="name"
						type="text"
						placeholder="Name"
						value={name}
						onChange={onChange}
						label="Name"
						variant="outlined"
					/>
				)}
				{signup && (
					<TextField
						name="email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={onChange}
						label="Email"
						variant="outlined"
					/>
				)}
				{signup && (
					<TextField
						name="url"
						type="url"
						placeholder="Profile Image URL"
						value={url}
						onChange={onChange}
						label="Profile Image URL"
						variant="outlined"
					/>
				)}
				<div className="form-signup">
					<FormControlLabel
						name="signup"
						id="signup"
						control={<Checkbox onChange={onChange} checked={signup} />}
						label="Create a new account?"
					/>
				</div>
				<Button variant="contained" type="submit" disabled={disabled}>
					{signup ? 'Sign Up' : 'Sign In'}
				</Button>
			</form>
		</>
	);
};

export default Login;
