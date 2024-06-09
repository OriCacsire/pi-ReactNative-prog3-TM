import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {auth, db} from '../firebase/config'

class Register extends Component {
    constructor(props){
        super(props)
        this.state={
            
        }
    }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
export default Register