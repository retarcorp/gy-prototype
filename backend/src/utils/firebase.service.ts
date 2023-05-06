import { Injectable } from "@nestjs/common";
import { authInstance } from '../config/firebase.app'
import * as auth from "@firebase/auth";

@Injectable()
export default class FirebaseService {

    private authInstance: any = authInstance;

    async registerUser(email: string, password: string): Promise<any> {
        return await auth.createUserWithEmailAndPassword(this.authInstance, email, password)
    }

    async signInUser(email: string, password: string): Promise<any> {
        return await auth.signInWithEmailAndPassword(this.authInstance, email, password)
    }

}