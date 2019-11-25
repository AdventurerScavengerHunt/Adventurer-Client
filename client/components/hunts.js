import React from "react"
import { Text, TextInput, View, Button, StyleSheet } from "react-native"
import { connect } from "react-redux"
//------------------------------------------------------------------
import MapScreen from "./map-screen"
import { fetchAllHunts } from "../store/hunts"
import { fetchCreatedHuntLocations } from "../store/huntLocations"
//------------------------------------------------------------------
// CONSTANTS
//------------------------------------------------------------------
class Hunts extends React.Component {
  constructor() {
    super()
    this.state = {
      huntSelected: false
    }
  }
  async componentDidMount() {
    await this.props.fetchAllHunts()
  }
  //------------------------------------------------------------------
  async handleSelectedHunt(huntId) {
    //Post to create hunts and put on state
    await fetchCreatedHuntLocations(this.props.user.id, huntId)
    this.setState({ huntSelected: true })
  }
  //------------------------------------------------------------------
  render() {
    const hunts = this.props.hunts
    const mapScreen = <MapScreen />
    const huntsScreen = (
      <View style={{ margin: 50 }}>
        {hunts.map(hunt => (
          <View key={hunt.id}>
            <Button
              title={hunt.name}
              onPress={() => this.handleSelectedHunt(hunt.id)}
            ></Button>
          </View>
        ))}
      </View>
    )
    return this.state.huntSelected ? mapScreen : huntsScreen
  }
}
//------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  errorMessageText: {
    textDecorationColor: "red"
  }
})
//------------------------------------------------------------------

const mapStateToProps = state => {
  return {
    user: state.user,
    hunts: state.hunts
  }
}
//------------------------------------------------------------------

const mapDispatchToProps = dispatch => {
  return {
    fetchAllHunts: () => dispatch(fetchAllHunts()),
    fetchCreatedHuntLocations: (userId, huntId) =>
      dispatch(fetchCreatedHuntLocations(userId, huntId))
  }
}
//------------------------------------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(Hunts)
