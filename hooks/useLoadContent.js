import content from "../redux/reducer/content";
import {useEffect} from "react";
import {useDispatch} from "react-redux";

export function useLoadContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(content.thunks.load());
  }, []);

}
