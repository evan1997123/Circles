const initState = { updatedComponents: 0 };

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
    case "UPDATED_USER_SETTINGS_SUCCESS":
      console.log("UPDATED_USER_SETTINGS_SUCCESS");

      console.log(state.updatedComponents);
      if (state.updatedComponents === 2) {
        alert("Updated User Information");
        return { ...state, updatedComponents: 0 };
      }
      return { ...state, updatedComponents: state.updatedComponents + 1 };
    case "UPDATE_SETTINGS_ERROR":
      console.log("SIGN_UP_ERROR");
      console.log(action.err);
      alert(action.err);
      return { ...state, updateSettingsError: action.err.message };
    default:
      return state;
  }
};

export default SettingsReducer;
