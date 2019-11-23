import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Login from "./client/components/login"

import { Provider } from "react-redux"
import store from "./client/store"

export default function App() {
  return (
    <Provider store={store}><Login></Login></Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})
