import { useDispatch } from "react-redux";
import { logOut } from "../store/user";
import { AnyAction } from '@reduxjs/toolkit';

export default function useLogOut() {
    const dispatch = useDispatch();
    const onLogOut = () => {
        console.log('Log out!');

        dispatch(logOut() as unknown as AnyAction)
    }

    return onLogOut;
}