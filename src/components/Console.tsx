import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {useEffect, useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import {useDispatch} from "../store";
import {refreshTextified} from "../store/log";
import {pushInput} from "../store/vm";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.hflex,
		fontSize: 16,
	},
	button: {
		height: "100%",
		padding: "0.5em",
		border: "1px solid white",
		backgroundColor: "transparent",
		color: "white",
		cursor: "pointer",
	},
	input: {
		flex: "1 1 auto",
		height: "100%",
		padding: "0.5em 1em",
		border: "1px solid white",
		backgroundColor: "transparent",
		color: "white",

		"&:focus": {
			outline: "none",
		},
	},
});

type Props = {
	className?: string;
};

const Console: FunctionComponent<Props> = (props) => {
	const {className} = props;
	const dispatch = useDispatch();
	const styles = useStyles();

	const [value, setValue] = useState("");
	const onSubmit = (event: Event) => {
		event.preventDefault();
		dispatch(refreshTextified());
		dispatch(pushInput({type: "normal", value}));
		setValue("");
	};
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => inputRef.current?.focus(), [inputRef]);

	return (
		<form className={classNames(styles.root, className)} onSubmit={onSubmit}>
			<button className={styles.button}>Enter</button>
			<input
				ref={inputRef}
				className={styles.input}
				type="text"
				value={value}
				onChange={(event: Event) => setValue((event.target as HTMLInputElement).value)}
			/>
		</form>
	);
};

export default Console;
