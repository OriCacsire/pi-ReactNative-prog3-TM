import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {db, auth} from '../firebase/config'

// Importo componente post para tener mis posteos en mi perfil
export default class MyProfile extends Component {
  render() {
    return (
      <View>
        <Text> MI PERFIL </Text>
      </View>
    )
  }
}
