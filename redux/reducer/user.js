import Builder from "../../utils/redux/builder";

/**
 * slice name
 * @type {string}
 */

const builder = new Builder({
  name: "user",
  initialState: {
    profile: null,
    token: null,
    requestStatus: null
  },
  reducers: {
    saveToken(state, {payload: token}) {
      state.token = token;
      localStorage.setItem("TOKEN_KEY", token);
    }
  }
})
  .addExtraReducer({
    ["requests/main/send/fulfilled"](state, action) {
      state.token = action.payload?.token;
      localStorage.setItem("TOKEN_KEY", action.payload?.token);
    }
  })
  .addExtraReducer({
    ["content/load/pending"](state, action) {
      state.requestStatus = action.meta?.requestStatus ? action.meta?.requestStatus : null;
    }
  })
  .addMatcher(() => true, (state, {payload = {}}) => {
    if (payload.hasOwnProperty("profile"))
      state.profile = payload.profile;
  })

builder.create();

const user = builder.export();

export default user;

export const {useUser} = user.selectors;
