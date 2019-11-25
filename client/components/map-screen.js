import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Text,
  SafeAreaView
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Permissions from "expo-permissions"
import * as Location from "expo-location"
import { connect } from "react-redux"
//------------------------------------------------------------------
import { fetchAllHuntLocations } from "../store/huntLocations"
//------------------------------------------------------------------
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421
//------------------------------------------------------------------
class MapScreen extends Component {
  //------------------------------------------------------------------
  constructor() {
    super()
    this.state = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      level: 0
    }
  }
  //------------------------------------------------------------------
  async componentDidMount() {
    //-------------------LOCATION-----------------------------------------------

    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === "granted") {
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      })
    }
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      error => {
        console.log("error: ", error)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    //---------------------HUNTS---------------------------------------------
    this.props.fetchAllHuntLocations(1) // Hardcoded User ID | Pending user state
  }
  //------------------------------------------------------------------
  handleFound(targetLat, targetLong) {
    //Math to compare target and current coordinates
    //MATH MATH MATH MATH MATH MATH
    //Make sure not moving past number of levels
    if (this.state.level < this.props.huntLocations.length - 1)
      //Increment next level
      this.setState({
        level: this.state.level + 1
      })
  }
  //------------------------------------------------------------------
  render() {
    let huntMarkers = this.props.huntLocations
    let userLoc = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <MapView style={styles.mapStyle} region={this.state}>
            {/* Current user location marker */}
            <Marker coordinate={userLoc}>
              <View style={styles.userLocMarker} />
            </Marker>
          </MapView>
        </View>
        {/* Database hunt location markers */}
        <View>
          <Text>{huntMarkers[this.state.level].riddle}</Text>
          <Text>
            TARGET: {huntMarkers[this.state.level].latitude} :{" "}
            {huntMarkers[this.state.level].longitude}
          </Text>
          <Text>
            CURR: {this.state.latitude} : {this.state.longitude}
          </Text>
          <Button
            title="FOUND"
            onPress={() =>
              this.handleFound(
                huntMarkers[this.state.level].latitude,
                huntMarkers[this.state.level].longitude
              )
            }
          />
        </View>
      </SafeAreaView>
    )
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
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  userLocMarker: {
    backgroundColor: "blue",
    borderColor: "lightblue",
    borderWidth: 2,
    padding: 3,
    borderRadius: 100
  },
  huntLocMarker: {
    backgroundColor: "red",
    borderColor: "pink",
    borderWidth: 2,
    padding: 5,
    borderRadius: 50
  },
  testWindow: {
    backgroundColor: "gray",
    position: "absolute",
    top: "10%"
  },
  riddle: {
    backgroundColor: "gray",
    position: "absolute",
    top: "90%"
  }
})
//------------------------------------------------------------------
const mapStateToProps = state => {
  return {
    huntLocations: state.huntLocations
  }
}
//------------------------------------------------------------------

const mapDispatchToProps = dispatch => {
  return {
    fetchAllHuntLocations: userId => dispatch(fetchAllHuntLocations(userId))
  }
}
//------------------------------------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
