import React from 'react'
import {View, Button, StyleSheet} from 'react-native'
import {connect} from 'react-redux' // Leaving for use with existing game
import {me} from '../store/user'
import {withNavigationFocus} from 'react-navigation'
//------------------------------------------------------------------
const NEW_GAME = 'NEW_GAME'
const RESUME_GAME = 'RESUME_GAME'
//------------------------------------------------------------------
class StartScreen extends React.Component {
  static navigationOptions = {
    headerLeft: null
  }
  constructor() {
    super()
    this.state = {hasNoPreviousGame: false}
    this.handleSelection = this.handleSelection.bind(this)
  }
  async componentDidMount() {
    console.log('re-mounting')
    await this.props.getUser()
    if (this.props.user.huntId === null) {
      this.setState({hasNoPreviousGame: true})
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      console.log('user before', this.props.user.huntId)
      await this.props.getUser()
      if (this.props.user.huntId === null) {
        this.setState({hasNoPreviousGame: true})
      } else {
        this.setState({hasNoPreviousGame: false})
      }
      console.log('user after', this.props.user.huntId)
    }
  }
  //------------------------------------------------------------------
  handleSelection(inSelection) {
    this.setState({hasNoPreviousGame: true})
    if (inSelection === NEW_GAME) {
      this.props.navigate('HuntScreen')
    } else if (inSelection === RESUME_GAME) {
      this.props.navigate('MapScreen')
    }
  }
  //------------------------------------------------------------------
  render() {
    return (
      <View style={{margin: 30}}>
        <View>
          <Button
            title="NEW GAME"
            onPress={() => this.handleSelection(NEW_GAME)}
          ></Button>
        </View>
        <View>
          <Button
            disabled={this.state.hasNoPreviousGame}
            title="RESUME"
            onPress={() => this.handleSelection(RESUME_GAME)}
          ></Button>
        </View>
      </View>
    )
  }
}
//------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    margin: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessageText: {
    textDecorationColor: 'red'
  }
})

//------------------------------------------------------------------

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    navigate: ownProps.navigation.navigate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(me())
  }
}
//------------------------------------------------------------------

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(StartScreen))
