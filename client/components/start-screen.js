import React from "react"
import { View, Button, StyleSheet } from "react-native"
import { connect } from "react-redux" // Leaving for use with existing game
//------------------------------------------------------------------
import MapScreen from "./map-screen"
import Hunts from "./hunts"
//------------------------------------------------------------------
const NEW_GAME = "NEW_GAME"
const RESUME_GAME = "RESUME_GAME"
//------------------------------------------------------------------
class StartScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      selection: ''
    }
    this.handleSelection = this.handleSelection.bind(this)
  }
  //------------------------------------------------------------------
  handleSelection(inSelection) {
    this.setState({
      selection: inSelection
    })
  }
  //------------------------------------------------------------------
  render() {
    const huntsScreen = <Hunts />
    const mapScreen = <MapScreen />
    const startScreen = (
      <View style={{ margin: 30 }}>
        <View>
          <Button
            disabled={false}
            title="NEW GAME"
            onPress={()=>this.handleSelection(NEW_GAME)}
          ></Button>
        </View>
        <View>
          <Button title="RESUME" onPress={()=>this.handleSelection(RESUME_GAME)}></Button>
        </View>
      </View>
    )

    if(this.state.selection=='') return startScreen
    else if(this.state.selection == NEW_GAME) return huntsScreen
    else if(this.state.selection == RESUME_GAME) return mapScreen
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
