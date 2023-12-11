import React, { useEffect } from 'react';

export default function useOutboundClick(
	ref: React.RefObject<Element> | null,
	callback: () => void,
	exceptRefs?: (React.RefObject<Element> | null)[],
) {
	useEffect(() => {
		function handleClickOutside(e: React.BaseSyntheticEvent | MouseEvent) {
			const isRefNotIncludeTarget = ref?.current && !ref.current.contains(e.target);

			const isExceptRefsNotIncludeTarget = exceptRefs
				? exceptRefs.every(exceptRef => exceptRef?.current && !exceptRef.current.contains(e.target))
				: true;

			if (isRefNotIncludeTarget && isExceptRefsNotIncludeTarget) callback();
		}

		document.addEventListener('click', handleClickOutside, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [ref, callback, exceptRefs]);
}
