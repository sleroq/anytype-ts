import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { ObjectName, ObjectDescription, ObjectType, IconObject, Loader } from 'Component';
import { S, U } from 'Lib';

interface Props {
	id?: string;
	object?: any;
	position?: () => void;
};

const PreviewTab = observer(forwardRef<{}, Props>((props, ref) => {

	const {
		id = '',
		object = {},
		position,
	} = props;

	const cn = [ 'previewDefault' ];

	useEffect(position);

	return (
		<div id={id} className={cn.join(' ')} data-id={object?.id}>
			<>
				<div className="previewHeader">
					<IconObject object={object} />
					<ObjectName object={object} withLatex={true} />
				</div>
			</>
		</div>
	);

}));

export default PreviewTab;
