/**
 * Scheduling Schemas — Barrel Export
 * ===================================
 *
 * WHY A BARREL FILE?
 * ------------------
 * Instead of importing each schema individually in the parent index.ts:
 *   import { bookingRequest } from './scheduling/bookingRequest'
 *   import { schedulingToken } from './scheduling/schedulingToken'
 *   import { schedulingConfig } from './scheduling/schedulingConfig'
 *
 * We export them all from one file:
 *   import { bookingRequest, schedulingToken, schedulingConfig } from './scheduling'
 *
 * This keeps the parent index.ts clean and groups related schemas together.
 */

export { bookingRequest } from './bookingRequest'
export { schedulingToken } from './schedulingToken'
export { schedulingConfig } from './schedulingConfig'
