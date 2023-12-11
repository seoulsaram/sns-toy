export const isMobile = () => {
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // 안드로이드 아이폰을 검사해 체크

	const isTouchDevice = navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;

	let isCheck = false;

	if (isMobile || isTouchDevice) {
		isCheck = true;
	}
	return isCheck;
};
