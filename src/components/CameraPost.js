import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Camera } from 'expo-camera'

class CameraPost extends Component {
constructor(props){
  super(props)
  this.state={
    dioPermiso:false,
    urlTemporal:''
  }
  this.metodoCamara = null
}


  render() {
    return (
      <View>
        {
          this.state.dioPermiso 
          ?
            this.state
          :
          <Text>No diste permisos para usar la Camara</Text>
        }
     

      </View>
    )
  }
}
export default CameraPost