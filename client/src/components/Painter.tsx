import { Button } from '@mui/material';
import React, { MouseEvent, RefObject, forwardRef, useState } from 'react';

const Painter = forwardRef((props: { onPaintSave: () => void; closePainter: () => void }, ref) => {
	const { onPaintSave, closePainter } = props;

	const [down, setDown] = useState(false);
	const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

	let canvasX = 0;
	let canvasY = 0;

	const startCanvas = (e: MouseEvent<HTMLCanvasElement>) => {
		const canvas = e.currentTarget.getContext('2d');
		if (canvas?.lineWidth) canvas.lineWidth = 3;
		setCanvasContext(canvas);

		setDown(true);
		canvasContext?.beginPath();

		canvasX = e.nativeEvent.offsetX;
		canvasY = e.nativeEvent.offsetY;
		canvasContext?.moveTo(canvasX, canvasY);
	};

	const startDraw = (e: MouseEvent<HTMLCanvasElement>) => {
		if (down) {
			canvasX = e.nativeEvent.offsetX;
			canvasY = e.nativeEvent.offsetY;
			canvasContext?.lineTo(canvasX, canvasY);
			canvasContext?.stroke();
		}
	};

	const stopDraw = (e: MouseEvent<HTMLCanvasElement>) => {
		setDown(false);
		canvasContext?.closePath();
	};

	return (
		<div id="painter">
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
					id="myCanvas"
					width="280px"
					height="280px"
					onMouseDown={startCanvas}
					onMouseMove={startDraw}
					onMouseUp={stopDraw}
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
