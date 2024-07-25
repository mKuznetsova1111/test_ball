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
      // extraName: "loadGame"
      saveData(state, action) {
        const {payload: {data}} = action;
        console.log("data")
        state.data = data;
        console.log(data, action)
      },
      saveError(){

      },
      onSubmit(){

      },
      func: async function () {
        data = await get(`https://jsonplaceholder.typicode.com/todos`);
        return data;
      }
    })
;

builder.create();

const content = builder.export();

export default content;

export const {useContent} = content.selectors;