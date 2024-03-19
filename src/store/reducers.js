import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import auth from "./auth/reducer";
import launchpadOption from "./launchpadOption/reducer";
import launchpad from "./launchpad/reducer";
import admin from "./admin/reducer";
import dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
	Layout,
	auth,
	launchpadOption,
	launchpad,
	admin,
	dashboard,
});

export default rootReducer;
