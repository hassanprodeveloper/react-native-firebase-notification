/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, {useState} from 'react';
import {useEffect} from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA6SMXqIa5keJSEGMh1XESt2LXz1CXX_hM',
  authDomain: 'swipee-dev.firebaseapp.com',
  projectId: 'swipee-dev',
  storageBucket: 'swipee-dev.appspot.com',
  databaseURL: '',
  messagingSenderId: '496994614139',
  appId: '1:496994614139:web:3450d43c91e7d321f41bde',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const app = firebase.app();
const messagingInitialized = firebase.messaging(app);

export default function App() {
  const [token, setToken] = useState('');

  console.log('token', token);

  // getting push notification permission
  useEffect(() => {
    messagingInitialized.requestPermission();
  }, []);

  useEffect(() => {
    // get the device token on app load
    messagingInitialized.getToken().then(token => {
      setToken(token);
    });

    // Setup a listener so that if the token is refreshed while the
    // app is in memory we get the updated token.
    return messagingInitialized.onTokenRefresh(token => {
      setToken(token);
    });
  }, []);

  // handling foreground notifications
  useEffect(() => {
    const unsubscribe = messagingInitialized.onMessage(
      async (remoteMessage = {}) => {
        const notification = remoteMessage.data || {};
        console.log('notification', remoteMessage);

        const title = notification.title;
        const body = notification.body;

        if (title) {
          Alert.alert(title, body);
        }
      },
    );

    return unsubscribe;
  }, []);

  // send the notification
  const sendNotification = async () => {
    Alert.alert(
      'Notification sent',
      'The destination will receive the notification',
    );
    try {
      await axios.post(
        'https://9d9gmb4jmd.execute-api.us-east-1.amazonaws.com/dev/',
        {token},
      );
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Push Notification Demo</Text>
      <View style={styles.textContainer}>
        <Text>
          <Text style={{fontWeight: 'bold'}}>Token:</Text> {token}
        </Text>
        <TouchableOpacity onPress={sendNotification}>
          <View style={styles.buttonContainer}>
            <Text>Send Notification</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    backgroundColor: 'beige',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginTop: 60,
  },
});
