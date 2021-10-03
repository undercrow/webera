import {h} from "preact";

import type {FunctionComponent} from "preact";
import {useEffect} from "preact/hooks";
import {useHistory, useParams} from "react-router";

import {useLocalStorage} from "../hooks";
import {useDispatch, useSelector} from "../store";
import {selectVM, startVM} from "../store/vm";
import {Slot} from "../slot";

type Params = {
	slot: string;
};

const Start: FunctionComponent = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const params = useParams<Params>();
	const [slot] = useLocalStorage<Slot | null>(`slot-${params.slot}`, null);
	const vm = useSelector(selectVM);
	if (slot == null || vm == null) {
		history.push("/");
	}

	useEffect(() => dispatch(startVM()), []);

	return (
		<div>
			Hello, World! (Start)
		</div>
	);
};

export default Start;
