export class User {
    constructor(readonly id: string,
                readonly name: string,
                readonly img: string,
                readonly isAdmin: Boolean = false) {
    }
}
