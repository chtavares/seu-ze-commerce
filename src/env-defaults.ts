import * as dotenv from 'dotenv';

export const ENVIRONMENT =
  process.env.APP_ENV || process.env.NODE_ENV || 'development';

dotenv.config({ path: `.${ENVIRONMENT}.env` });
