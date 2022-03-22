import dotenv from 'dotenv';
dotenv.config();

const parseString = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not present`);
  }
  return value;
};

const parseNumber = (key: string): number => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not present`);
  }
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    throw new Error(`${key} should be a number`);
  }
  return parsed;
};

const parseBoolean = (key: string): boolean => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not present`);
  }
  if (value === 'TRUE' || value === 'true') {
    return true;
  } else if (value === 'FALSE' || value === 'false') {
    return false;
  }
  throw new Error(`${key} should be TRUE or true or FALSE or false`);
};

export default {
  AUTH0_CALLBACK_URL: parseString('AUTH0_CALLBACK_URL'),
  AUTH0_CLIENT_ID: parseString('AUTH0_CLIENT_ID'),
  AUTH0_CLIENT_SECRET: parseString('AUTH0_CLIENT_SECRET'),
  AUTH0_DOMAIN: parseString('AUTH0_DOMAIN'),
  AUTH0_API_V2_MANAGEMENT: parseString('AUTH0_API_V2_MANAGEMENT'),
  PORT: parseNumber('PORT'),
  NODE_ENV: parseString('NODE_ENV'),
  SERVER_URL: parseString('SERVER_URL'),
  CLIENT_URL: parseString('CLIENT_URL'),
  REDIS_SERVER_URL: parseString('REDIS_SERVER_URL'),
  SESSION_DURATION_MINUTES: parseNumber('SESSION_DURATION_MINUTES'),
  STATIC_DIR: parseString('STATIC_DIR'),
  AWS_BUCKET_NAME: parseString('AWS_BUCKET_NAME'),
  AWS_REGION: parseString('AWS_REGION'),
  AWS_ACCESS_KEY_ID: parseString('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: parseString('AWS_SECRET_ACCESS_KEY'),
};
