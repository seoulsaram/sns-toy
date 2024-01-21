import React, { ErrorInfo } from 'react';

interface Props {
	children: React.ReactNode;
	fallbackComponent?: React.ReactNode;
}
interface State {
	hasError: boolean;
}
class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		// Example "componentStack":
		//   in ComponentThatThrows (created by App)
		//   in ErrorBoundary (created by App)
		//   in div (created by App)
		//   in App
		console.log({ error, info });
	}

	render() {
		const { hasError } = this.state;
		const { children, fallbackComponent } = this.props;
		console.log('hasError', hasError);
		if (hasError) {
			if (fallbackComponent) {
				return <div>{fallbackComponent}</div>;
			}
			return (
				<div style={{ width: '100vw', height: '100vh', background: 'white' }}>
					<h2 style={{ color: 'black' }}>Oops, there is an error!</h2>
					<button style={{ background: 'pink' }} onClick={() => this.setState({ hasError: false })}>
						Try again?
					</button>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
