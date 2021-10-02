import {h} from "preact";

import {render} from "preact";
import {Provider as ReduxProvider} from "react-redux";

import "./reset.css";

import store from "./store";
import App from "./App";

render((
	<ReduxProvider store={store}>
		<App />
	</ReduxProvider>
), document.getElementById("root")!);
