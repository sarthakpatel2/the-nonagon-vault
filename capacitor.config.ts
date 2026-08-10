import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e24604c4b77b4119ad8bb9710903fa27',
  appName: 'The Nonagon Vault',
  webDir: 'dist',
  server: {
    // Loads the live app so the native shell always shows the latest build.
    // Remove this block if you'd rather bundle a static build inside the app.
    url: 'https://the-nonagon-vault.lovable.app',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
