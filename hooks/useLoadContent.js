import content from "../redux/reducer/content";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import requests from "../redux/reducer/requests";

export function useLoadContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requests.thunks.mainLoad());
  }, []);
}
