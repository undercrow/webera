import {h} from "preact";

import type {FunctionComponent} from "preact";
import {Redirect, Route, Switch} from "react-router-dom";

import Root from "./pages/Root";
import Start from "./pages/Start";

const App: FunctionComponent = () => (
	<Switch>
		<Route exact path="/">
			<Root />
		</Route>
		<Route exact path="/:slot">
			<Start />
		</Route>
		<Route path="*">
			<Redirect to="/" />
		</Route>
	</Switch>
);

export default App;
