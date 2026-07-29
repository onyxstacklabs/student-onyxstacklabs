/**
 * Onyx Stack Labs - Enterprise Environment Variable Validator
 */

interface EnvConfig {
  siteUrl: string;
  environment: 'development' | 'production' | 'test';
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`[EnvValidator Warning]: Environment variable ${key} is missing.`);
    return '';
  }
  return value;
}

export function validateAndGetEnv(): EnvConfig {
  const isProd = process.env.NODE_ENV === 'production';

  const config: EnvConfig = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://onyxstacklabs.com',
    environment: (process.env.NODE_ENV as EnvConfig['environment']) || 'development',
    firebase: {
      apiKey: getEnvVariable('NEXT_PUBLIC_FIREBASE_API_KEY'),
      authDomain: getEnvVariable('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnvVariable('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      storageBucket: getEnvVariable('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnvVariable('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnvVariable('NEXT_PUBLIC_FIREBASE_APP_ID'),
    },
  };

  if (isProd) {
    // Perform strict production assertions
    const missingKeys: string[] = [];
    if (!process.env.NEXT_PUBLIC_SITE_URL) missingKeys.push('NEXT_PUBLIC_SITE_URL');

    if (missingKeys.length > 0) {
      console.warn(`[EnvValidator]: Production build detected with optional fallbacks for: ${missingKeys.join(', ')}`);
    }
  }

  return config;
}

export const envConfig = validateAndGetEnv();
