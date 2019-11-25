import React from "react"
import { View, Button, StyleSheet } from "react-native"
import { connect } from "react-redux" // Leaving for use with existing game
//------------------------------------------------------------------
import MapScreen from "./map-screen"
import Hunts from "./hunts"
//------------------------------------------------------------------
// CONSTANTS
//------------------------------------------------------------------
class StartScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      newGame: false,
      resumeGame: false,
      selection: false
    }
    this.handleNewGame = this.handleNewGame.bind(this)
    this.handleResumeGame = this.handleResumeGame.bind(this)
  }
  //------------------------------------------------------------------
  handleNewGame() {
    this.setState({
      selection: true,
      newGame: true
    })
  }
  //------------------------------------------------------------------
  handleResumeGame() {
    this.setState({ selection: true, resumeGame: true })
  }
  //------------------------------------------------------------------
  render() {
    const huntsScreen = <Hunts />
    const mapScreen = <MapScreen />
    const startScreen = 
      <View style={{ margin: 30 }}>
        <View>
          <Button
            disabled={false}
            title="NEW GAME"
            onPress={this.handleNewGame}
          ></Button>
        </View>
        <View>
          <Button title="RESUME" onPress={this.handleResumeGame}></Button>
        </View>
      </View>
    
    return this.selection
      ? this.newGame
        ? huntsScreen
        : mapScreen
      : startScreen
  }
}
//------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    margin: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  errorMessageText: {
    textDecorationColor: "red"
  }
})

export default StartScreen
