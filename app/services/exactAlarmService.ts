import { NativeModules } from 'react-native';

const { ExactAlarmModule } = NativeModules;

export const requestExactAlarmPermission = async (): Promise<boolean> => {
  try {
    // Request permission from the native module
    const permissionGranted = await ExactAlarmModule.requestExactAlarmPermission();
    // Return true if permission is granted, otherwise false
    return permissionGranted;
  } catch (error: any) {
    console.log('Error requesting exact alarm permission:', error.message || error);    
    // Return false to indicate failure in obtaining permission
    return false;
  }
};