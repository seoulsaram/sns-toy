export const isMobile = () => {
	const user = navigator.userAgent;
	console.log('userAgent', user);
	let isCheck = false;

	if (user.indexOf('iPhone') > -1 || user.indexOf('Android') > -1) {
		isCheck = true;
	}
	console.log('isCheck', isCheck);
	return isCheck;
};
