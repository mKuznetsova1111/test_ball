import Builder from "../../utils/redux/builder";
import {get, post} from "../../utils/api/api";
import axios from "axios";

// let data;

const builder = new Builder({
    name: "content",
    initialState: {
      data: []
    },
    reducers: {
      setData(state, {payload: {label, data: _data}}) {
        state.data = _data;
        data = _data;
      }
    }
  })
    .createExtraReducer({
      thunkName: "load",
      saveData(state, action) {
        const {payload: {data}} = action;
        state.data = data;
      },
      func: async function () {
        data = await get(`https://jsonplaceholder.typicode.com/todos`);
        console.log("sdfhsdjf")
        return data;
      }
    })
    // .createSelector("content", state => ({...state.content, ...data}))
    .addMatcher(() => true, (state, {payload = {}}) => {
      if (payload.hasOwnProperty("data"))
        state.data = payload.data;
    })
;

builder.create();

const content = builder.export();

export default content;

export const {useContent} = content.selectors;
