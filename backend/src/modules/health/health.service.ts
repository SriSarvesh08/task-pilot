import { Injectable } from '@nestjs/common';
import { HealthResponse } from './health.types.js';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'taskpilot-api',
    };
  }
}
