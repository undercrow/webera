import {h} from "preact";

import classNames from "classnames";
import type {FunctionComponent} from "preact";
import {useRef, useState} from "preact/hooks";
import {createUseStyles} from "react-jss";

import CheckCircle from "../components/svg/CheckCircle";
import Sync from "../components/svg/Sync";
import {useSelector} from "../store";
import {selectSlots} from "../store/slot";
import * as sx from "../style-util";
import {Slot} from "../typings/metadata";

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
	nameInput: {
		width: "100%",
		marginLeft: "0.5em",
		padding: "0.2em",
		border: "1px solid white",
		backgroundColor: "transparent",
		color: "white",

		"&:focus": {
			outline: "none",
		},
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
	onCreate?: (slot: Slot, file: File) => void | Promise<void>;
};

const NewSlot: FunctionComponent<Props> = (props) => {
	const {className, onCreate} = props;
	const styles = useStyles();
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const slots = useSelector(selectSlots);
	const fileRef = useRef<HTMLInputElement>(null);
	const onSubmit = async () => {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		const file = fileRef.current!.files?.item(0);

		if (name === "") {
			setError("Please set the name of the slot");
			return;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		} else if (slots[name] != null) {
			setError(`Slot ${name} already exists`);
			return;
		} else if (file == null) {
			setError("Please specify the file for this slot");
			return;
		} else if (
			file.type !== "application/zip" &&
			file.type !== "application/x-zip" &&
			file.type !== "application/x-zip-compressed"
		) {
			setError("Only zip files are supported");
			return;
		}

		setError(null);
		await onCreate?.({name}, file);
		setIsSubmitting(false);
	};

	return (
		<div className={classNames([styles.root, className])}>
			<div className={styles.body}>
				<label className={styles.label}>
					Name:
					<input
						className={styles.nameInput}
						type="text"
						value={name}
						onChange={(e) => setName((e.target as HTMLInputElement).value)}
					/>
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

export default NewSlot;
