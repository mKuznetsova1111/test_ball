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
    .addExtraReducer({
      ["requests/main/load/fulfilled"](state, action) {
        console.log(action)
        state.data = action.payload;
      }
    })
;

builder.create();

const content = builder.export();

export default content;

export const {useContent} = content.selectors;
