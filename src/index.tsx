import {h} from "preact";

import {render} from "preact";
import {Provider as ReduxProvider} from "react-redux";
import {HashRouter} from "react-router-dom";

import "./reset.css";

import store from "./store";
import App from "./App";

render((
	<ReduxProvider store={store}>
		<HashRouter hashType="noslash">
			<App />
		</HashRouter>
	</ReduxProvider>
), document.getElementById("root")!);
