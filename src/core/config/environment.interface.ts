// Environment configuration type
export interface EnvironmentConfig {
  apiUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features: {
    enableOfflineMode: boolean;
    enableNotifications: boolean;
  };
}
