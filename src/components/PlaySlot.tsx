import {h} from "preact";

import classNames from "classnames";
import {VM} from "erajs";
import {loadAsync} from "jszip";
import type {FunctionComponent} from "preact";
import {useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import * as era from "../era";
import CheckCircle from "../components/svg/CheckCircle";
import Sync from "../components/svg/Sync";
import {Slot} from "../slot";
import * as sx from "../style-util";

const useStyles = createUseStyles({
	"@keyframes spin": {
		"100%": {
			transform: "rotate(-360deg)",
		},
	},
	root: {
		...sx.hflex,
		justifyContent: "flex-start",
		padding: "1em",
		fontSize: 16,
	},
	spin: {
		animation: "$spin 2s linear infinite",
	},
	body: {
		...sx.vflex,
		alignItems: "flex-start",
		width: "100%",
		marginRight: "0.5em",
	},
	label: {
		...sx.hflex,
		width: "100%",
		marginBottom: "0.5em",
	},
	nameText: {
		width: "100%",
		marginLeft: "0.5em",
		color: "white",
	},
	fileInput: {
		width: "100%",
		marginLeft: "2em",

		"&:focus": {
			outline: "none",
		},
	},
	error: {
		fontSize: 14,
		color: "red",
	},
	icon: {
		cursor: "pointer",
	},
});

type Props = {
	className?: string;
	onPlay?: (vm: VM) => void;
	slot: Slot;
};

const PlaySlot: FunctionComponent<Props> = (props) => {
	const {className, onPlay, slot} = props;
	const styles = useStyles();
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const onSubmit = async () => {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		try {
			const file = fileRef.current!.files?.item(0);

			if (file == null) {
				throw new Error("Please specify the file for this slot");
			} else if (file.type !== "application/zip") {
				throw new Error("Only zip file is supported");
			}

			const buffer = await file.arrayBuffer();
			const zip = await loadAsync(buffer);
			const hash = await era.hash(zip);
			if (slot.hash !== hash) {
				throw new Error("File hash does not match");
			}
			setError(null);

			onPlay?.(await era.compile(zip));
		} catch (e) {
			setError((e as Error).message);
		}
		setIsSubmitting(false);
	};

	return (
		<div className={classNames([styles.root, className])}>
			<div className={styles.body}>
				<label className={styles.label}>
					Name:
					<span className={styles.nameText}>{slot.name}</span>
				</label>
				<label className={styles.label}>
					File:
					<input className={styles.fileInput} type="file" ref={fileRef} />
				</label>
				{error != null ?
					<span className={styles.error}>{error}</span> :
					null
				}
			</div>
			{isSubmitting ?
				<Sync className={classNames(styles.icon, styles.spin)} color="white" size={48} /> :
				<CheckCircle className={styles.icon} color="white" size={48} onClick={onSubmit} />
			}
		</div>
	);
};

export default PlaySlot;
