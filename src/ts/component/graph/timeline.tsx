import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import $ from 'jquery';
import { observer } from 'mobx-react';
import { Icon, DragHorizontal } from 'Component';
import { S, J, translate } from 'Lib';

interface Props {
	id: string;
	graphRef: any;
	storageKey: string;
};

const SPEEDS = [ 1, 2, 4 ];

const GraphTimeline = observer(forwardRef<{}, Props>(({
	id = '',
	graphRef,
	storageKey = '',
}, ref) => {

	const nodeRef = useRef(null);
	const dragRef = useRef(null);
	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ position, setPosition ] = useState(0);
	const [ dateLabel, setDateLabel ] = useState('');
	const [ speed, setSpeed ] = useState(1);
	const [ dummy, setDummy ] = useState(0);
	const settings = S.Common.getGraph(storageKey);

	const onPlay = useCallback(() => {
		if (isPlaying) {
			graphRef.current?.timelinePause();
			setIsPlaying(false);
		} else {
			graphRef.current?.timelineStart(speed);
			setIsPlaying(true);
		};
	}, [ isPlaying, speed ]);

	const onSpeedChange = useCallback(() => {
		const idx = SPEEDS.indexOf(speed);
		const next = SPEEDS[(idx + 1) % SPEEDS.length];

		setSpeed(next);

		if (isPlaying) {
			graphRef.current?.timelineStart(next);
		};
	}, [ isPlaying, speed ]);

	const onSeekMove = useCallback((e: any, v: number) => {
		graphRef.current?.timelineSeek(v);
	}, []);

	const onSeekEnd = useCallback((e: any, v: number) => {
		graphRef.current?.timelineSeek(v);
	}, []);

	useEffect(() => {
		const win = $(window);

		const onTimelineUpdate = (e: any, data: any) => {
			setPosition(data.position);
			setDateLabel(data.dateLabel);
			setIsPlaying(data.isPlaying);
			dragRef.current?.setValue(data.position);
		};

		const onTimelineComplete = () => {
			setIsPlaying(false);
		};

		const onSettingsUpdate = () => {
			setDummy(v => v + 1);
		};

		win.on(`timelineUpdate.${id}`, onTimelineUpdate);
		win.on(`timelineComplete.${id}`, onTimelineComplete);
		win.on(`updateGraphSettings.${id}`, onSettingsUpdate);

		return () => {
			win.off(`timelineUpdate.${id} timelineComplete.${id} updateGraphSettings.${id}`);
			graphRef.current?.timelineReset();
		};
	}, []);

	if (!settings.timeline) {
		return null;
	};

	return (
		<div ref={nodeRef} className="graphTimeline">
			<div className="controls">
				<div
					className={[ 'iconPlay', isPlaying ? 'active' : '' ].join(' ')}
					onMouseDown={onPlay}
					onClick={e => e.stopPropagation()}
				/>

				<div
					className="speed"
					onClick={onSpeedChange}
				>
					{speed}x
				</div>

				<div className="dragWrapper">
					<DragHorizontal
						ref={dragRef}
						value={position}
						onMove={onSeekMove}
						onEnd={onSeekEnd}
					/>
				</div>

				<div className="dateLabel">
					{dateLabel}
				</div>
			</div>
		</div>
	);

}));

export default GraphTimeline;
