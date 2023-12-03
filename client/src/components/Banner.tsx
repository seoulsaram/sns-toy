import React, { memo } from 'react';

type Props = {
	text: string;
	isAlert: boolean;
};
const Banner = memo(({ text, isAlert }: Props) =>
	text ? <p className={`banner ${isAlert ? 'banner-red' : 'banner-green'}`}>{text}</p> : null,
);
export default Banner;
