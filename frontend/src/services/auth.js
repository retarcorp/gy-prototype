import { authInstance } from "../config/firebase.app";
import * as auth from "@firebase/auth";

export function createUser(email, password) {
    return auth.createUserWithEmailAndPassword(authInstance, email, password);
}

export function signIn(email, password) {
    return auth.signInWithEmailAndPassword(authInstance, email, password);
}