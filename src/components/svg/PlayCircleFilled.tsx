import {h} from "preact";

import type {FunctionComponent} from "preact";

type Props = {
	className?: string;
	onClick?: () => void;
	size?: 18 | 24 | 36 | 48;
	color: string;
};

/* eslint-disable max-len */
const PlayCircleFilled: FunctionComponent<Props> = (props) => {
	const {className, color, onClick} = props;
	const size = props.size ?? 24;

	return (
		<svg viewBox="0 0 24 24" fill={color} class={className} width={size} height={size} onClick={onClick}>
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
		</svg>
	);
};
/* eslint-enable max-len */

export default PlayCircleFilled;
