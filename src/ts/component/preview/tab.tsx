import React, { forwardRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { ObjectName, IconObject } from 'Component';

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

	const cn = [ 'previewTab' ];

	useEffect(position);

	return (
		<div id={id} className={cn.join(' ')} data-id={object?.id}>
			<div className="previewHeader">
				<IconObject object={object} />
				<ObjectName object={object} withLatex={true} />
			</div>
		</div>
	);

}));

export default PreviewTab;
