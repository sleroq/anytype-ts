import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { ObjectName, IconObject } from 'Component';
import { U } from 'Lib';

interface Props {
	spaceview?: any;
	object?: any;
	position?: () => void;
};

const PreviewTab = observer(forwardRef<{}, Props>((props, ref) => {

	const {
		spaceview = {},
		object,
		position,
	} = props;

	const [ dummy, setDummy ] = useState(0);
	const objectRef = useRef(object);

	useEffect(() => {
		if (!object?.id) {
			return;
		};

		objectRef.current = object;

		U.Object.getById(object.id, { spaceId: spaceview.targetSpaceId }, (loaded: any) => {
			if (loaded) {
				objectRef.current = loaded;
				setDummy(dummy + 1);
			};
		});
	}, [ object?.id ]);

	useEffect(position);

	return (
		<div className="previewTab">
			<div className="previewHeader">
				<IconObject object={spaceview} />
				<ObjectName object={spaceview} />
			</div>
			{object ? (
				<div className="previewObject">
					<IconObject object={objectRef.current} />
					<ObjectName object={objectRef.current} />
				</div>
			) : null}
		</div>
	);

}));

export default PreviewTab;
