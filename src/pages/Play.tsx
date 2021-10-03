import {h} from "preact";

import type {FunctionComponent} from "preact";
import {useEffect} from "preact/hooks";
import {createUseStyles} from "react-jss";
import {useHistory, useParams} from "react-router";

import Console from "../components/Console";
import LogList from "../components/LogList";
import {useLocalStorage} from "../hooks";
import {useDispatch, useSelector} from "../store";
import {selectVM, startVM} from "../store/vm";
import * as sx from "../style-util";
import {Slot} from "../typings/slot";

const useStyles = createUseStyles({
	root: {
		...sx.vflex,
		width: "100%",
		height: "100%",
		padding: "2rem",
		backgroundColor: "black",
		color: "white",
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
	const [slot] = useLocalStorage<Slot | null>(`slot-${params.slot}`, null);
	const vm = useSelector(selectVM);
	if (slot == null || vm == null) {
		history.push("/");
	}

	useEffect(() => dispatch(startVM()), []);

	return (
		<div className={styles.root}>
			<div className={styles.spacer} />
			<LogList className={styles.body} />
			<Console className={styles.console} />
		</div>
	);
};

export default Play;
