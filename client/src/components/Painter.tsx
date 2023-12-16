import { Button } from '@mui/material';
import React, { MouseEvent, RefObject, TouchEventHandler, forwardRef, useState } from 'react';
import { isMobile } from '../util/findAgent';

const Painter = forwardRef((props: { onPaintSave: () => void; closePainter: () => void }, ref) => {
	const { onPaintSave, closePainter } = props;

	const [down, setDown] = useState(false);
	const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

	const startCanvas = (e: MouseEvent<HTMLCanvasElement>) => {
		const canvas = e.currentTarget.getContext('2d');
		if (canvas?.lineWidth) canvas.lineWidth = 3;
		setCanvasContext(canvas);

		setDown(true);
		canvasContext?.beginPath();
		canvasContext?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
	};

	const startDraw = (e: MouseEvent<HTMLCanvasElement>) => {
		if (down) {
			moveStroke(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
	};

	const startMobileCanvas = (e: React.TouchEvent<HTMLCanvasElement>) => {
		const event = e.target as HTMLCanvasElement;
		const canvas = event.getContext('2d');

		if (canvas?.lineWidth) canvas.lineWidth = 3;

		setCanvasContext(canvas);
		setDown(true);
		canvasContext?.beginPath();

		const touch = e.touches[0];
		canvasContext?.moveTo(
			touch.clientX - event.getBoundingClientRect().left,
			touch.clientY - event.getBoundingClientRect().top,
		);
	};

	const startMobileDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (down) {
			const touch = e.touches[0];
			const canvas = e.target as HTMLCanvasElement;

			moveStroke(
				touch.clientX - canvas.getBoundingClientRect().left,
				touch.clientY - canvas.getBoundingClientRect().top,
			);
		}
	};

	const stopDraw = (e: MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		setDown(false);
		canvasContext?.closePath();
	};

	const moveStroke = (x: number, y: number) => {
		canvasContext?.lineTo(x, y);
		canvasContext?.stroke();
	};

	return (
		<div id={`${isMobile() ? 'mobile-painter' : 'painter'}`}>
			<div className="painter-color-palette">
				<input
					className="painter-selected-color"
					type="color"
					onChange={e => {
						const color = e.target.value;
						if (canvasContext) {
							canvasContext.strokeStyle = color;
							setCanvasContext(canvasContext);
						}
					}}
				/>
			</div>

			<div id="drawingBoard">
				<canvas
					ref={ref as RefObject<HTMLCanvasElement>}
					width="280px"
					height="280px"
					onMouseDown={startCanvas}
					onMouseMove={startDraw}
					onMouseUp={stopDraw}
					onTouchStart={startMobileCanvas}
					onTouchMove={startMobileDraw}
					onTouchEnd={stopDraw}
				>
					Oops! Canvas not supported in this browser
				</canvas>
			</div>
			<div className="painter-button-group">
				<Button variant="contained" size="small" onClick={onPaintSave}>
					Save
				</Button>
				<Button variant="outlined" size="small" onClick={closePainter}>
					Cancel
				</Button>
			</div>
		</div>
	);
});

export default Painter;
