import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('loyalty')
export class LoyaltyHandler {
  @Process('retryFailed')
  async handleFailedRequest(job: Job) {
    console.log(job.data);
  }
}
