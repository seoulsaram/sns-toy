import React, { memo } from 'react';

type Props = {
	name: string;
	url: string | undefined;
	size?: number;
};
const Avatar = memo(({ url, name, size = 38 }: Props) => (
	<div>
		{url ? (
			<img src={url} alt="avatar" className="avatar-img" width={size} height={size} />
		) : (
			<div
				className="avatar-txt"
				style={{
					width: `${size}px`,
					height: `${size}px`,
				}}
			>
				{name?.charAt(0)}
			</div>
		)}
	</div>
));

export default Avatar;
