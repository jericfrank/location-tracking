export const BATCH_CONFIG = {
  /** Number of records to batch before saving */
  BATCH_SIZE: 100,
  
  /** Max time (ms) to wait before flushing batch */
  BATCH_INTERVAL: 5000,
  
  /** Queue concurrency (1 = sequential processing) */
  QUEUE_CONCURRENCY: 1,
} as const;
