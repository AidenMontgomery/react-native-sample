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
  TouchableHighlight,
  AppState
} from 'react-native';

class reactnativelocalpushnotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationToPost: undefined,
      checkedNotificationPermissions: false,
      allowedToReceiveNotifications: false
    };
  }

  componentWillMount() {
    // Add listener for local notifications
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
    PushNotificationIOS.addEventListener('register', this._onPushNotificationRegistration.bind(this));
  }

  componentWillUnmount() {
    // Remove listener for local notifications
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
    PushNotificationIOS.removeEventListener('register', this._onPushNotificationRegistration);
  }

  _onPushNotificationRegistration(token) {
    console.log('Registered for notifications', token);

    this.setState({
      checkedNotificationPermissions: true,
      allowedToReceiveNotifications: true
    });

    if (this.state.notificationToPost) {
      this._scheduleNotification(this.state.notificationToPost);
    }
  }

  _requestNotificationPermissions(notification) {
    this.setState({
      notificationToPost: notification
    });

    PushNotificationIOS.requestPermissions();
  }

  _prepareNotification(soundName, badge) {
    let notification = {
      alertBody: "Hello From app",
      applicationIconBadgeNumber: badge,
      fireDate: new Date(Date.now() + (1000 * 10)).getTime(),
      soundName: soundName
    };

    if (this.state.checkedNotificationPermissions) {
      if (this.state.allowedToReceiveNotifications) {
        this._scheduleNotification(notification);
      }
    } else {
      PushNotificationIOS.checkPermissions((permissions) => {
        console.log(permissions);

        if (permissions.alert) {
          this.setState({
            checkedNotificationPermissions: true,
            allowedToReceiveNotifications: true
          });

          this._scheduleNotification(notification);
        } else {
          this.setState({
            checkedNotificationPermissions: true,
            allowedToReceiveNotifications: false
          });

          this._requestNotificationPermissions(notification);
        }
      });
    }
  }

  _scheduleNotification(notification) {
    PushNotificationIOS.scheduleLocalNotification(notification);
    this.setState({notificationToPost: undefined})
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
    // PushNotificationIOS.requestPermissions();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={() => this._prepareNotification('', 5)}>
          <Text style={styles.buttonText}>Schedule Silent Notification</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this._prepareNotification('default', -1)}>
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
