import {addHeaders, get, post} from "../utils/api/api";
import storage from "../utils/storage";

const _storage = storage("info", ({access_token} = {}) => {
  addHeaders({
    "Authorization": access_token ? `Bearer ${access_token}` : false
  })
});
_storage.load()

export function login(data) {
  return post("/user/login", data)
    .then(saveAuth)
}

export function signup(data) {
  return post("/user/signup", data)
    .then(saveAuth)
}

export function update(data) {
  return post("/user/update", data)
}

export function profile() {
  return get("/user/profile")
}

export function logout() {
  return post("/user/logout")
    .then(saveAuth)
}

export function customAuth(data) {
  return fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => {
    return res.json()
  })
}
export function customDataLoad() {
  return get(`https://jsonplaceholder.typicode.com/todos`);
}

function saveAuth(data) {
  _storage.save(data?.profile);

  return data;
}

