import RNLocation from 'react-native-location';

// Initialize RNLocation
RNLocation.configure({
  distanceFilter: 5.0, // Example configuration, adjust as needed
});

export function checkLocation(onEnabled: () => void, onDisabled: () => void) {
  RNLocation.checkPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'fine', // or 'fine'
    },
  })
    .then((granted) => {
      if (granted) {
        return onEnabled();
      } else {
        return onDisabled();
      }
    })
    .catch((err) => console.log('Error getting location:', err));
}

export async function requestLocation(
  onEnabled: () => void,
  onDisabled: () => void
) {
  try {
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse', // iOS specific configuration (optional)
      android: {
        detail: 'fine', // Android specific configuration (optional)
      },
    });
    if (granted) {
      // Permission granted, proceed with location-related operations
      return onEnabled();
    } else {
      // Permission denied, handle this case (e.g., show a message or disable location features)
      return onDisabled();
    }
  } catch (error) {
    // Handle permission request errors
    console.log(error);
  }
}
