// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';

// export async function registerForPushNotificationsAsync() {
//     if (!Device.isDevice) {
//         alert('Must use physical device for Push Notifications');
//         return null;
//     }

//     try {
//         const { status: existingStatus } = await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;

//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }

//         if (finalStatus !== 'granted') {
//             alert('Failed to get push token for push notification!');
//             return null;
//         }

//         const { data: token } = await Notifications.getExpoPushTokenAsync();
//         return token;
//     } catch (err) {
//         console.error('Error during push token registration:', err);
//         return null;
//     }
// }

import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const notifications = [
  { id: '1', title: 'Order Shipped', message: 'Your order #12345 has been shipped.', date: '2025-08-07 10:30' },
  { id: '2', title: 'Payment Received', message: 'We have received your payment for order #12345.', date: '2025-08-06 14:20' },
  { id: '3', title: 'New Offer', message: 'Get 25% off on your next purchase!', date: '2025-08-05 09:10' },
];

const NotificationItem = ({ title, message, date }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <Text style={styles.date}>{date}</Text>
  </View>
);

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            title={item.title}
            message={item.message}
            date={item.date}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

