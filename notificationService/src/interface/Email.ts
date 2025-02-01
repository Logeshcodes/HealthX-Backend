export interface EmailInterface {
    sentEmailVerification(name: string, email: string, verification: string) : Promise <boolean>
}

export interface ForgotEmailInterface {
    sendEmailVerification( email: string, verification: string) : Promise <boolean>
}