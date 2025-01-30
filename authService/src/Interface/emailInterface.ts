export interface EmailInterface {
    SendEmailVerification(name: string, email: string, verification: string) : Promise <boolean>
}