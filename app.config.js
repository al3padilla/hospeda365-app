const { expo } = require('./app.json');

// These identifiers must match the Android/iOS apps registered in Firebase.
module.exports = () => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const iosUrlScheme = iosClientId?.endsWith('.apps.googleusercontent.com')
    ? `com.googleusercontent.apps.${iosClientId.slice(0, -'.apps.googleusercontent.com'.length)}`
    : undefined;
  return {
    ...expo,
    owner: 'apolocreed',
    extra: { ...expo.extra, eas: { ...expo.extra?.eas } },
    android: {
      ...expo.android,
      package: process.env.GOOGLE_ANDROID_PACKAGE?.trim() || 'com.hospeda365.app',
    },
    ios: {
      ...expo.ios,
      bundleIdentifier: process.env.GOOGLE_IOS_BUNDLE_IDENTIFIER?.trim() || 'com.hospeda365.app',
    },
    plugins: [
      ...expo.plugins,
      ['@react-native-google-signin/google-signin', {
        // Android can build before iOS credentials are supplied.
        iosUrlScheme: iosUrlScheme || 'com.googleusercontent.apps.hospeda365-unconfigured',
      }],
    ],
  };
};
