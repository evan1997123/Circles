const initState = {};

const NotificationReducer = (state = initState, action) => {
    switch (action.type) {
        case "DISMISS_NOTIFICATION":
            console.log("dismissed notification");
            return state;
        case "DISMISS_NOTIFICATION_ERROR":
            console.log("dismiss notification error");
            return state;
        default:
            return state;
    }
}