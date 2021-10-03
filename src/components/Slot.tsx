import {h} from "preact";

import {VM} from "erajs";
import type {FunctionComponent} from "preact";

import EmptySlot from "../components/EmptySlot";
import NewSlot from "../components/NewSlot";
import PlaySlot from "../components/PlaySlot";
import ValidSlot from "../components/ValidSlot";
import {Slot} from "../typings/slot";

type Props = {
	onCreate?: (slot: Slot) => void;
	onDelete?: () => void;
	onPlay?: (vm: VM) => void;
	onSelect?: () => void;
	selected: boolean;
	slot: Slot | null;
};

const SlotComponent: FunctionComponent<Props> = (props) => {
	const {onCreate, onDelete, onPlay, onSelect, selected, slot} = props;

	if (slot != null) {
		if (selected) {
			return <PlaySlot slot={slot} onPlay={onPlay} />;
		} else {
			return <ValidSlot slot={slot} onSelect={onSelect} onDelete={onDelete} />;
		}
	} else {
		if (selected) {
			return <NewSlot onCreate={onCreate} />;
		} else {
			return <EmptySlot onClick={onSelect} />;
		}
	}
};

export default SlotComponent;
