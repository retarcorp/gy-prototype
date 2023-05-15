import { useEffect, useState } from "react";
import AuthFacade from "./AuthFacade/AuthFacade";
import { useDispatch, useSelector } from "react-redux";
import UserArea from "../UserArea/UserArea";
import AdminPage from "../AdminArea/AdminPage";
import { validateToken } from "../../store/user";
import AuthStub from "./AuthFacade/AuthStub";

export default function Facade({ mode = 'loading' }) {

    const [internalMode, setInternalMode] = useState(mode);
    const currentUser = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.user.isLoading);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(validateToken());
    }, [])

    useEffect(() => { setInternalMode(mode); }, [mode])
    useEffect(() => {
        if (isLoading) {
            return setInternalMode('loading');
        }
        if (currentUser) {
            setInternalMode('authorized');
            if (currentUser.isAdmin) {
                setInternalMode('admin');
            } else {
                setInternalMode('user');
            }
        } else {
            setInternalMode('auth');
        }

    }, [currentUser, isLoading])

    return <>
        {internalMode === 'loading' ? <AuthStub /> : null}
        {internalMode === 'auth' ? <AuthFacade /> : null}
        {internalMode === 'user' ? <UserArea /> : null}
        {internalMode === 'admin' ? <AdminPage /> : null}
    </>

}