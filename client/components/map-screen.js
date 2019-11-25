import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Text,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { connect } from 'react-redux';
//------------------------------------------------------------------
import {
  fetchAllHuntLocations,
  fetchVisitedHuntLocation,
} from '../store/huntLocations';
import { coordDist } from '../../coordinate-logic';
//------------------------------------------------------------------
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;
//------------------------------------------------------------------
class MapScreen extends Component {
  //------------------------------------------------------------------
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      level: 0,
      score: 0,
    };
    this.handleFound = this.handleFound.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }
  //----------------FUNCTIONS--------------------------------------
  async componentDidMount() {
    //-------------------LOCATION PERMISSIONS-------------------------------

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
    }
    //-------SET LOCATION TRACKING------------------------------------------
    setInterval(this.updatePosition, 2000);
    //---------------------HUNTS---------------------------------------------
    this.props.fetchHuntLocations(this.props.user.id);
  }
  //------------------------------------------------------------------
  handleFound(targetLat, targetLong) {
    //Math to compare target and current coordinates
    //Make sure not moving past number of levels

    //variable declarations
    let huntMarkers = this.props.huntLocations;
    let huntLocId = huntMarkers[this.state.level].huntLocation.locationId;
    let withinDistance =
      coordDist(
        this.state.latitude,
        this.state.longitude,
        targetLat,
        targetLong
      ) < 5000;
    let levelsToComplete =
      this.props.huntLocations.length - 1 - this.state.level;

    //conditional logic
    if (withinDistance) {
      //update visited to "true" for this location
      this.props.fetchVisitLocation(this.props.user.id, huntLocId);
      //increment score
      this.setState(prevState => {
        return { score: prevState.score + 1 };
      });

      if (levelsToComplete > 0) {
        //Increment next level
        this.setState(prevState => {
          return { level: prevState.level + 1 };
        });
      } else if (levelsToComplete === 0) {
        console.log('yay');
        //display "You win!" and redirect to start screen
      }
    }
  }
  updatePosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('error: ', error);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 }
    );
  }
  //------------------------------------------------------------------
  render() {
    let huntMarkers = this.props.huntLocations;
    let userLoc = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    let level = this.state.level;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <MapView style={styles.mapStyle} region={this.state}>
            {/* Current user location marker */}
            <Marker coordinate={userLoc}>
              <View style={styles.userLocMarker} />
            </Marker>
            {/* Testing database hunt location markers */}
            {!huntMarkers
              ? null
              : huntMarkers.map(marker => {
                  const coords = {
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude),
                  };
                  return (
                    <Marker key={marker.id} coordinate={coords}>
                      <View style={styles.huntLocMarker} />
                    </Marker>
                  );
                })}
          </MapView>
        </View>
        {/* Database hunt location info */}
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.scoreText}>
            {this.state.score} / {this.props.huntLocations.length}
          </Text>
        </View>
        <View>
          <Text>{huntMarkers[level].riddle}</Text>
          <Text>
            TARGET: {huntMarkers[level].latitude} :{' '}
            {huntMarkers[level].longitude}
          </Text>
          <Text>
            CURR: {this.state.latitude} : {this.state.longitude}
          </Text>
          {coordDist(
            this.state.latitude,
            this.state.longitude,
            huntMarkers[level].latitude,
            huntMarkers[level].longitude
          ) < 5000 ? (
            <Text>Ya found me!</Text>
          ) : (
            <Text>Keep searchin'!</Text>
          )}
          <Button
            title="FOUND"
            onPress={() =>
              this.handleFound(
                huntMarkers[level].latitude,
                huntMarkers[level].longitude
              )
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}
//------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  userLocMarker: {
    backgroundColor: 'blue',
    borderColor: 'lightblue',
    borderWidth: 2,
    padding: 3,
    borderRadius: 100,
  },
  huntLocMarker: {
    backgroundColor: 'red',
    borderColor: 'pink',
    borderWidth: 2,
    padding: 5,
    borderRadius: 50,
  },
  scoreBlock: {
    backgroundColor: 'rgba(165, 42, 42, 0.7)',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  scoreText: {
    color: 'goldenrod',
  },
  testWindow: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: '10%',
  },
  riddle: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: '90%',
  },
});
//------------------------------------------------------------------
const mapStateToProps = state => {
  return {
    huntLocations: state.huntLocations,
    user: state.user,
  };
};
//------------------------------------------------------------------
const mapDispatchToProps = dispatch => {
  return {
    fetchHuntLocations: userId => dispatch(fetchAllHuntLocations(userId)),
    fetchVisitLocation: (userId, locationId) =>
      dispatch(fetchVisitedHuntLocation(userId, locationId)),
  };
};
//------------------------------------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
