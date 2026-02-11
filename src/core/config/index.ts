import { EnvironmentConfig } from './environment.interface';

/**
 * Get the current environment configuration based on NEXT_PUBLIC_ENV
 */
export const getEnvironmentConfig = async (): Promise<EnvironmentConfig> => {
  const env = process.env.NEXT_PUBLIC_ENV || 'dev';
  
  switch (env) {
    case 'prod':
      return (await import('@/environments/env.prod')).envConfig;
    case 'staging':
      return (await import('@/environments/env.staging')).envConfig;
    case 'dev':
    default:
      return (await import('@/environments/env.dev')).envConfig;
  }
};

// For synchronous access (use carefully)
export const getCurrentEnv = (): 'dev' | 'staging' | 'prod' => {
  const env = process.env.NEXT_PUBLIC_ENV || 'dev';
  return env as 'dev' | 'staging' | 'prod';
};
