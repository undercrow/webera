import {h} from "preact";

import {render} from "preact";
import {Provider as ReduxProvider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import "./reset.css";

import store from "./store";
import App from "./App";

render((
	<ReduxProvider store={store}>
		<Router basename={BASENAME}>
			<App />
		</Router>
	</ReduxProvider>
), document.getElementById("root")!);
