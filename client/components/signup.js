import React from 'react'
import {Text, TextInput, View, Button, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {auth} from '../store/user'

const SIGNUP = 'signup'

class SignUp extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: null
    }
    this.createAccount = this.createAccount.bind(this)
  }

  async createAccount() {
    this.setState({
      errorMessage: null
    })
    if (
      this.state.password === this.state.confirmPassword &&
      this.state.password.length >= 3
    ) {
      try {
        await this.props.signup(
          this.state.email,
          this.state.password,
          SIGNUP,
          this.state.username
        )
        this.props.navigate('StartScreen')
      } catch (error) {
        this.setState({
          errorMessage: error
        })
      }
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errorMessage: 'Passwords do not match'
      })
    } else if (this.state.password.length < 3) {
      this.setState({
        errorMessage: 'Password must be longer than 3 characters'
      })
    }
  }

  render() {
    return (
      <View style={{margin: 30}}>
        <Text style={{fontSize: 27}}>SIGNUP</Text>
        <TextInput
          placeholder="Username"
          onChangeText={text => this.setState({username: text})}
          value={this.state.username}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          onChangeText={text => this.setState({password: text})}
          secureTextEntry={true}
          value={this.state.password}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Confirm Password"
          onChangeText={text => this.setState({confirmPassword: text})}
          secureTextEntry={true}
          value={this.state.confirmPassword}
          autoCapitalize="none"
        />
        <View style={{margin: 7}} />
        {this.state.errorMessage ? (
          <Text style={styles.errorMessageText}>{this.state.errorMessage}</Text>
        ) : (
          <Text />
        )}
        <Button title="Create Account" onPress={this.createAccount} />
      </View>
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
  errorMessageText: {
    textDecorationColor: 'red'
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    navigate: ownProps.navigation.navigate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signup: (email, password, method, username) =>
      dispatch(auth(email, password, method, username))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
