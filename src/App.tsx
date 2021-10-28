import {h} from "preact";

import type {FunctionComponent} from "preact";
import {Redirect, Route, Switch} from "react-router-dom";

import Play from "./pages/Play";
import Root from "./pages/Root";

const App: FunctionComponent = () => (
	<Switch>
		<Route exact path="/">
			<Root />
		</Route>
		<Route exact path="/slot/:slot">
			<Play />
		</Route>
		<Route path="*">
			<Redirect to="/" />
		</Route>
	</Switch>
);

export default App;
