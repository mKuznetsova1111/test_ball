import Builder from "../../utils/redux/builder";
import {get, post} from "../../utils/api/api";
import axios from "axios";

let data;

const builder = new Builder({
    name: "content",
    initialState: {
      data: []
    }
  })
    .createExtraReducer({
      thunkName: "load",
      // extraName: "loadGame"
      saveData(state, action) {
        state.data = action.payload;
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
    .addExtraReducer({
      ["content/load/fulfilled"](state, action) {
        state.data = action.payload;
      }
    })
;

builder.create();

const content = builder.export();

export default content;

export const {useContent} = content.selectors;
