import {h} from "preact";

import type {FunctionComponent} from "preact";

type Props = {
	className?: string;
	onClick?: () => void;
	size?: 18 | 24 | 36 | 48;
	color: string;
};

/* eslint-disable max-len */
const Delete: FunctionComponent<Props> = (props) => {
	const {className, color, onClick} = props;
	const size = props.size ?? 24;

	return (
		<svg viewBox="0 0 24 24" fill={color} class={className} width={size} height={size} onClick={onClick}>
			<path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
		</svg>
	);
};
/* eslint-enable max-len */

export default Delete;
