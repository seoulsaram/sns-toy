import React, { memo, useState } from 'react';

type Props = {
	name: string;
	url: string | undefined;
	size?: number;
};
const Avatar = memo(({ url, name, size = 38 }: Props) => {
	const [showPrev, setShowPrev] = useState(false);

	return (
		<div>
			{url ? (
				<div className="avatar-container">
					<button onClick={() => setShowPrev(!showPrev)} /* onMouseLeave={() => setShowPrev(false)} */>
						<img src={url} alt="avatar" className="avatar-img" width={size} height={size} />
					</button>
					{showPrev ? (
						<button className="avatar-viewer-container" onClick={() => setShowPrev(false)}>
							<img className="avatar-viewer" src={url} alt="avatar" width={size} height={size} />
						</button>
					) : null}
				</div>
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
	);
});

export default Avatar;
