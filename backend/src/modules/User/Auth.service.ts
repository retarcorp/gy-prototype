import { Injectable } from "@nestjs/common";

@Injectable()
export default class AuthService {
    constructor() { }

    async registerUser(email: string, password: string): Promise<any> {
        return { email, password }
    }
}