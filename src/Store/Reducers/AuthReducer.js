const initState = {
  authError: null
};

const AuthReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      console.log("LOGIN_ERROR");
      return { ...state, authError: "Login Failed" };
    case "LOGIN_SUCCESS":
      console.log("LOGIN_SUCCESS");
      return { ...state, authError: null };
    case "SIGN_OUT_SUCCESS":
      console.log("SIGN_OUT_SUCESS");
      return state;
    case "SIGN_UP_SUCCESS":
      console.log("SIGN_UP_SUCCESS");
      return { ...state, authError: null };
    case "SIGN_UP_ERROR":
      console.log("SIGN_UP_ERROR");
      console.log(action.err);
      return { ...state, authError: action.err.message };
    default:
      return state;
  }
};

export default AuthReducer;
