const initState = {};

const RewardReducer = (state = initState, action) => {
    // Depends on the type of the dispatch
    switch (action.type) {
        case "ADDED_REWARD_TO_CIRCLE":
            console.log("added reward to circle", action.reward);
            return state;
        case "CREATE_REWARD":
            console.log("created reward", action.reward);
            return state;
        case "CREATE_REWARD_ERROR":
            console.log("CREATE_REWARD_ERROR", action.err);
            return state;
        case "CLAIM_REWARD":
            console.log("claimed reward");
            return state;
        case "CLAIM_REWARD_ERROR":
            console.log("claim reward error", action.err);
            return state;
        case "DELETE_REWARD":
            console.log("deleted reward");
            return state;
        default:
            return state;
    }
}

export default RewardReducer;