import React from 'react';
import { ConnectionLineComponentProps } from 'react-flow-renderer';

const ConnectionLine = ({
	sourceX,
	sourceY,
	targetX,
	targetY
}: ConnectionLineComponentProps): JSX.Element => {
	return (
		<g>
			<path
				fill='none'
				stroke='#fff'
				strokeWidth={5}
				d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
			/>
			<path
				fill='none'
				stroke='#222'
				strokeWidth={5}
				className='animated'
				d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
			/>
			<circle cx={targetX} cy={targetY} fill='#fff' r={3} stroke='#222' strokeWidth={1.5} />
		</g>
	);
};

export default ConnectionLine;
