/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AlertIOS,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  TouchableHighlight
} from 'react-native';

class reactnativelocalpushnotifications extends Component {
  componentWillMount() {
    // Add listener for local notifications
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
  }

  componentWillUnmount() {
    // Remove listener for local notifications
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  _scheduleNotification(soundName, badge) {
    let notification = {
      alertBody: "Hello From app",
      applicationIconBadgeNumber: badge,
      fireDate: new Date(Date.now() + (1000 * 10)).getTime(),
      soundName: soundName
    };

    PushNotificationIOS.scheduleLocalNotification(notification);
  }

  _onLocalNotification(notification) {
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  componentDidMount() {
    PushNotificationIOS.requestPermissions();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={() => this._scheduleNotification('', 5)}>
          <Text style={styles.buttonText}>Schedule Silent Notification</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this._scheduleNotification('default', -1)}>
          <Text style={styles.buttonText}>Schedule Normal Notification</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    height: 50,
    width: 200,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
  }
});

AppRegistry.registerComponent('reactnativelocalpushnotifications', () => reactnativelocalpushnotifications);
