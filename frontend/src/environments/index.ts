import { EnvironmentConfig } from '@/core/config/environment.interface';
import { envConfig as devConfig } from './env.dev';
import { envConfig as stagingConfig } from './env.staging';
import { envConfig as prodConfig } from './env.prod';

const env = process.env.NEXT_PUBLIC_ENV || 'dev';

const getConfig = (): EnvironmentConfig => {
  switch (env) {
    case 'prod':
      return prodConfig;
    case 'staging':
      return stagingConfig;
    case 'dev':
    default:
      return devConfig;
  }
};

export const environment = getConfig();
export const envConfig = environment;
