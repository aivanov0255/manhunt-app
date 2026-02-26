import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Permission denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  return location;
}

export { getLocation };