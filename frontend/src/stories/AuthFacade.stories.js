import AuthFacade from "../views/Facade/AuthFacade/AuthFacade";

// create storybook story for Facade react component
export default {
    title: 'Example/AuthFacade',
    component: AuthFacade,
    argTypes: {
        mode: 'string'
    }
}

export const SignIn = {
    args: {
        mode: 'signIn'
    }
}

export const SignUp = {
    args: {
        mode: 'signUp'
    }
}

export const FacebookSignIn = {
    args: {
        mode: 'facebookSignIn'
    }
}

export const Authorized = {
    args: {
        mode: 'authorized'
    }
}