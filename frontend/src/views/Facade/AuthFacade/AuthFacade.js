
import { useEffect, useState } from "react";
import FacebookSignIn from "./FacebookSignIn";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import useErrorAlert from "./useErrorAlert";
import AuthStub from "./AuthStub";
import { useDispatch, useSelector } from "react-redux";
import { setInternalError, signIn, signUp } from "../../../store/user";
export const MODES = {
    signIn: 'signIn',
    signUp: 'signUp',
    facebookSignIn: 'facebookSignIn',
    authorized: 'authorized'
}

export default function AuthFacade({ mode = 'signIn', onAuthorized = () => { } }) {

    const [errorComponent, displayError] = useErrorAlert();

    const isLoading = useSelector(state => state.user.isLoading);
    const internalError = useSelector(state => state.user.internalError);
    const currentUser = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [internalMode, setInternalMode] = useState('signIn');

    useEffect(() => {
        if (internalError) {
            displayError(internalError);
            dispatch(setInternalError(null));
        }
    }, [internalError, dispatch, displayError]);

    useEffect(() => { setInternalMode(mode); }, [mode])


    const switchers = {
        onSignIn: () => setInternalMode(MODES.signIn),
        onSignUp: () => setInternalMode(MODES.signUp),
        onFacebookSignIn: () => setInternalMode(MODES.facebookSignIn)
    }

    const onSignIn = (args) => {
        dispatch(signIn(args.email, args.password));
    }

    const onSignUp = (args) => {
        if (args.password !== args.repeatPassword) {
            return displayError('Passwords must be the same!')
        }
        dispatch(signUp(args.email, args.password));
    };

    return <>
        {currentUser ? <div>Authorized</div> : null}
        {internalMode === 'signIn' ? <SignIn {...switchers} onSignIn={onSignIn} /> : null}
        {internalMode === 'signUp' ? <SignUp {...switchers} onSignUp={onSignUp} /> : null}
        {internalMode === 'facebookSignIn' ? <FacebookSignIn {...switchers} /> : null}
        {isLoading ? <AuthStub /> : null}
        {errorComponent()}
    </>;
}