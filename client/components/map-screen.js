import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions, Button, Text, SafeAreaView } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { fetchAllHuntLocations } from '../store/huntLocations';

class MapScreen extends Component {
  constructor() {
    super();
    this.state = {
      userLatitude: 0,
      userLongitude: 0,
    }
  }
  async componentDidMount() {
    // this.props.fetchHuntLocations(this.props.user.id)
    this.props.fetchHuntLocations(1)

    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      console.log("Location granted: ", location)
    }

    this.watchId = navigator.geolocation.watchPosition((position) => {
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude
        })
      }, (error) => {
        console.log('error: ', error)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  render() {
    let huntMarkers = this.props.huntLocations
    let userLoc = { latitude: this.state.userLatitude, longitude: this.state.userLongitude }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
          <MapView
            style={styles.mapStyle}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            {/* Current user location marker */}
            <Marker coordinate={userLoc}>
              <View style={styles.userLocMarker} />
            </Marker>
            {/* Database hunt location markers */}
            {!huntMarkers
              ? null
              : huntMarkers.map(marker => {
                  const coords = {
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude)
                  };
                  const metadata = `Marker ID: ${marker.id}`

                  return (
                    <Marker
                      key={marker.id}
                      coordinate={coords}
                      title="{metadata}"
                      description={metadata}
                    >
                      <View style={styles.huntLocMarker} />
                    </Marker>
                  );
                })}
          </MapView>
        </View>
        <View style={styles.testWindow}>
          <Text>Hello, I'm currently located at latitude: {this.state.userLatitude} and longitude: {this.state.userLongitude}</Text>
        </View>
        <View style={styles.riddle}>
          <Text></Text>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  userLocMarker: {
    backgroundColor: 'blue',
    borderColor: 'lightblue',
    borderWidth: 2,
    padding: 3,
    borderRadius: 100
  },
  huntLocMarker: {
    backgroundColor: 'red',
    borderColor: 'pink',
    borderWidth: 2,
    padding: 5,
    borderRadius: 50
  },
  testWindow: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: '10%'
  },
  riddle: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: '90%'
  }
})

const mapStateToProps = state => {
  return {
    huntLocations: state.huntLocations,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return { fetchHuntLocations: () => dispatch(fetchAllHuntLocations()) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
