import {h} from "preact";

import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";
import {useHistory, useParams} from "react-router";

import Console from "../components/Console";
import LogList from "../components/LogList";
import ErrorPopup from "../components/ErrorPopup";
import {useAsyncEffect} from "../hooks";
import {useDispatch, useSelector} from "../store";
import {selectError, startVM} from "../store/vm";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		position: "relative",
		width: "100%",
		height: "100%",
		padding: "2rem",
		backgroundColor: "black",
		color: "white",
	},
	popup: {
		position: "absolute",
		top: "50%",
		left: "50%",
		maxWidth: "50%",
		transform: "translate(-50%, -50%)",
	},
	spacer: {
		flex: "1 1 auto",
	},
	body: {
		width: "100%",
		flex: "1 1 auto",
	},
	console: {
		width: "100%",
	},
});

type Params = {
	slot: string;
};

const Play: FunctionComponent = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const styles = useStyles();
	const params = useParams<Params>();
	const error = useSelector(selectError);

	useAsyncEffect(() => dispatch(startVM(params.slot)), [params.slot]);
	const onBack = () => history.push("/");
	const onRetry = () => dispatch(startVM(params.slot));

	return (
		<div className={styles.root}>
			{error != null ?
				<ErrorPopup className={styles.popup} error={error} onBack={onBack} onRetry={onRetry} /> :
				null
			}
			<div className={styles.spacer} />
			<LogList className={styles.body} />
			<Console className={styles.console} />
		</div>
	);
};

export default Play;
