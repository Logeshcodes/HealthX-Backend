export interface EmailInterface {
    sentEmailVerification(name: string, email: string, verification: string) : Promise <boolean>
}

export interface ForgotEmailInterface {
    sendEmailVerification( email: string, verification: string) : Promise <boolean>
}

export interface RejectionEmailInterface {
    sendRejectionDoctorEmail(email: string, reason: string) : Promise <boolean>
}


export interface ApprovalEmailInterface {
    sendApprovalDoctorEmail(email: string) : Promise <boolean>
}