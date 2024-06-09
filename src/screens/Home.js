import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { auth } from "../firebase/config"

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }



  render() {
    return (
      <View>
        <Text> Hola </Text>
      </View>
    )
  }
}
