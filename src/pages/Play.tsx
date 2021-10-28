import {h} from "preact";

import localforage from "localforage";
import jszip from "jszip";
import type {FunctionComponent} from "preact";
import {createUseStyles} from "react-jss";
import {useParams} from "react-router";

import Console from "../components/Console";
import LogList from "../components/LogList";
import * as era from "../era";
import {useAsyncEffect} from "../hooks";
import {useDispatch} from "../store";
import {startVM} from "../store/vm";
import * as sx from "../style-util";
import Metadata from "../typings/metadata";

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
	const dispatch = useDispatch();
	const styles = useStyles();
	const params = useParams<Params>();
	useAsyncEffect(async () => {
		const metadata = await localforage.getItem<Metadata>("metadata/" + params.slot);
		if (metadata == null) {
			throw new Error(`Metadata for slot ${params.slot} does not exist`);
		}

		const raw = await localforage.getItem<File>("files/" + params.slot);
		if (raw == null) {
			throw new Error(`File for slot ${params.slot} does not exist`);
		}

		const zip = await jszip.loadAsync(await raw.arrayBuffer());
		const files = await era.extract(zip);
		const vm = era.compile(files);
		await dispatch(startVM(vm, metadata.slot));
	}, [params.slot]);

	return (
		<div className={styles.root}>
			<div className={styles.spacer} />
			<LogList className={styles.body} />
			<Console className={styles.console} />
		</div>
	);
};

export default Play;
