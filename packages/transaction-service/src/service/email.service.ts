import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor() {}

  async sendEmail(email: string, type: 'success' | 'pending' | 'failed') {
    //TODO: Implement email sending, an async operation
  }
}