import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: "br.com.erp",
  appName: "dynpages-client",
  bundledWebRuntime: false,
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    "CapacitorUpdater": {
      "autoUpdate": false
    }
  },
  server: {
    androidScheme: 'https'
  },
  "cordova": {}
};

export default config;
