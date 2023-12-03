import React, { memo } from 'react';

type Props = {
	name: string;
	url: string | undefined;
};
const Avatar = memo(({ url, name }: Props) => (
	<div>
		{url ? <img src={url} alt="avatar" className="avatar-img" /> : <div className="avatar-txt">{name?.charAt(0)}</div>}
	</div>
));

export default Avatar;
