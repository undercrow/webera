import {h, Fragment} from "preact";

import classnames from "classnames";
import {EraJSError} from "erajs";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";

import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		padding: "2em",
		backgroundColor: "black",
		border: "1px solid white",
		transform: "translate(-50%, -50%)",
	},
	title: {
		marginBottom: "1.5em",
		fontSize: 20,
		fontWeight: "bold",
		lineHeight: 1.2,
		textAlign: "center",
	},
	message: {
		marginBottom: "1.5em",
		fontSize: 16,
		textAlign: "center",
	},
	info: {
		marginBottom: "0.5em",
		fontSize: 14,
		textAlign: "center",
	},
	buttonList: {
		...sx.hflex,
		marginTop: "2em",
	},
	button: {
		padding: "0.5em",
		color: "white",
		border: "1px solid white",
		fontWeight: "bold",
		cursor: "pointer",

		"&+&": {
			marginLeft: "2em",
		},
	},
});

type Props = {
	className?: string;
	onBack?: () => void;
	onRetry?: () => void;
	error: Error;
};

const ErrorPopup: FunctionComponent<Props> = (props) => {
	const {className, error, onBack, onRetry} = props;
	const styles = useStyles();

	return (
		<div className={classnames(styles.root, className)}>
			<h2 className={styles.title}>Error detected!</h2>
			<span className={styles.message}>{error.message}</span>
			{error instanceof EraJSError ?
				(
					<Fragment>
						<span className={styles.info}>At: {error.line.file} line {error.line.line}</span>
						<span className={styles.info}>{error.line.content}</span>
						<span className={styles.info}>Trace: {error.trace.join(" > ")}</span>
					</Fragment>
				) :
				null
			}
			<div className={styles.buttonList}>
				<button className={styles.button} onClick={onBack}>
					Go Back
				</button>
				<button className={styles.button} onClick={onRetry}>
					Retry
				</button>
			</div>
		</div>
	);
};

export default ErrorPopup;
