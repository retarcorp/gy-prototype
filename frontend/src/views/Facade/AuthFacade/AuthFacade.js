
import { useEffect, useState } from "react";
import FacebookSignIn from "./FacebookSignIn";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { createUser, signIn } from "../../../services/auth";
import useErrorAlert from "./useErrorAlert";
import AuthStub from "./AuthStub";

export const MODES = {
    signIn: 'signIn',
    signUp: 'signUp',
    facebookSignIn: 'facebookSignIn',
    authorized: 'authorized'
}


export default function AuthFacade({ mode = 'signIn', onAuthorized = () => {} }) {

    const [errorComponent, displayError] = useErrorAlert();

    const [internalMode, setInternalMode] = useState('signIn');
    useEffect(() => {
        setInternalMode(mode);
    }, [mode])

    const [isRequesting, setIsRequesting] = useState(false);

    const switchers = {
        onSignIn: () => setInternalMode(MODES.signIn),
        onSignUp: () => setInternalMode(MODES.signUp),
        onFacebookSignIn: () => setInternalMode(MODES.facebookSignIn)
    }


    const onSignIn = (args) => {
        setIsRequesting(true)
        signIn(args.email, args.password)
            .then((res) => {
                setInternalMode('authorized');
                onAuthorized(res);
            })
            .catch((error) => {
                displayError(error.message)
            })
            .finally(() => setIsRequesting(false))
    };

    const onSignUp = (args) => {
        if (args.password !== args.repeatPassword) {
            return displayError('Passwords must be the same!')
        }

        setIsRequesting(true)
        createUser(args.email, args.password)
            .then((res) => {
                setInternalMode('authorized')
                onAuthorized(res);
            })
            .catch((error) => {
                displayError(error.message)
            })
            .finally(() => setIsRequesting(false)) ;
    };

    return <>
        {internalMode === 'signIn' ? <SignIn {...switchers} onSignIn={onSignIn} /> : null}
        {internalMode === 'signUp' ? <SignUp {...switchers} onSignUp={onSignUp} /> : null}
        {internalMode === 'facebookSignIn' ? <FacebookSignIn {...switchers} /> : null}
        {isRequesting ? <AuthStub />: null}
        {errorComponent()}
    </>;
}