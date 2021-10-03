import {h} from "preact";

import type {FunctionComponent} from "preact";

import EmptySlot from "../components/EmptySlot";
import NewSlot from "../components/NewSlot";
import ValidSlot from "../components/ValidSlot";
import {Slot} from "../slot";

type Props = {
	onCreate?: (slot: Slot) => void;
	onSelect?: () => void;
	selected: boolean;
	slot: Slot | null;
};

const SlotComponent: FunctionComponent<Props> = (props) => {
	const {onCreate, onSelect, selected, slot} = props;

	if (slot != null) {
		return <ValidSlot slot={slot} />;
	} else {
		if (selected) {
			return <NewSlot onCreate={onCreate} />;
		} else {
			return <EmptySlot onClick={onSelect} />;
		}
	}
};

export default SlotComponent;
