export declare class EmailService {
    constructor();
    sendEmail(email: string, type: 'success' | 'pending' | 'failed'): Promise<void>;
}
