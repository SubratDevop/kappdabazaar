import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Alert, Linking, Platform, Share } from 'react-native';

export const downloadFile = async (url, fileName, headers = {}) => {
  try {
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer',
    });

    const fileUri = FileSystem.documentDirectory + fileName;

    // Convert arraybuffer to base64
    const base64Data = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const shareFile = async (fileUri, fileName) => {
  try {
    if (Platform.OS === 'ios') {
      await Share.share({
        url: fileUri,
        title: fileName,
      });
    } else {
      await Share.share({
        url: `file://${fileUri}`,
        title: fileName,
      });
    }
  } catch (error) {
    // Fallback: try to open with system app
    try {
      await Linking.openURL(`file://${fileUri}`);
    } catch (linkError) {
      Alert.alert('Info', 'File saved to app directory. You can find it in your file manager.');
    }
  }
};

export const showDownloadSuccess = (fileName, fileUri) => {
  Alert.alert(
    'Download Complete',
    `File saved successfully: ${fileName}`,
    [
      { text: 'OK' },
      { 
        text: 'Share File', 
        onPress: () => shareFile(fileUri, fileName)
      }
    ]
  );
};

export default {
  downloadFile,
  shareFile,
  showDownloadSuccess,
}; 