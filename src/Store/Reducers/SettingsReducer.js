const initState = {};

const SettingsReducer = (state = initState, action) => {
    switch (action.type) {
    case "SET_USERNAME":
        console.log("set username");
        return state;
    case "SET_FIRSTNAME":
        console.log("set firstname");
        return state;
    case "SET_LASTNAME":
        console.log("set lastname");
        return state;
    case "SET_EMAIL":
        console.log("set email");
        return state;
    case "SET_PASSWORD":
        console.log("set password");
        return state;
    case "SET_ERROR":
        console.log("settings error:", action.err);
        return state;
    default:
        return state;
  }
};

export default SettingsReducer;