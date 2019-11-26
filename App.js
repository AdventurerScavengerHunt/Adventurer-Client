import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './client/components/login';
import MapScreen from './client/components/map-screen';
import StartScreen from './client/components/start-screen';
import SignUp from './client/components/signup';
import HuntScreen from './client/components/hunts';

import { Provider } from 'react-redux';
import store from './client/store';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    SignUp: SignUp,
    StartScreen: StartScreen,
    HuntScreen: HuntScreen,
    MapScreen: MapScreen,
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
