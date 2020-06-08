const initState = {};

const SettingsReducer = (state = initState, action) => {
    switch (action.type) {
    case "SET USERNAME":
        console.log("set username");
        return state;
    case "SET FIRSTNAME":
        console.log("set firstname");
        return state;
    case "SET LASTNAME":
        console.log("set lastname");
        return state;
    case "SET_ERROR":
        console.log("settings error:", action.err);
        return state;
    default:
        return state;
  }
};

export default SettingsReducer;