import React, {Component} from 'react'
import Login from './client/components/login'
import MapScreen from './client/components/map-screen'
import StartScreen from './client/components/start-screen'
import SignUp from './client/components/signup'
import HuntScreen from './client/components/hunts'
import InstructionScreen from './client/components/instructions'

import {Provider} from 'react-redux'
import store from './client/store'

import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    SignUp: SignUp,
    StartScreen: StartScreen,
    HuntScreen: HuntScreen,
    MapScreen: MapScreen,
    InstructionScreen: InstructionScreen
  },
  {
    initialRouteName: 'Login'
  }
)

const AppContainer = createAppContainer(AppNavigator)

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  )
}
