import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { auth,db } from "../firebase/config"

export default class CrearPost extends Component {
  constructor(props){
    super(props)
    this.state = {
        descripcion: ""
    }
  }

  onSubmit(descripcion){
    if (descripcion !== "") {
        db.collection("posts").add({
            descripcion: descripcion,
            owner: auth.currentUser.email,
            createdAt: Date.now(),
            imageUrl: "", //FALTA
            likes: [],
            comments: []
        })
        .then((resp)=> console.log(resp))
        .catch((err) => console.log(err))
    }
  }

  render() {
    return (
      <View>
        <TextInput
        onChangeText={(text)=> this.setState({descripcion: text})}
        placeholder='Descripción del posteo'
        />
        <TouchableOpacity
        onPress={()=> this.onSubmit(this.state.descripcion)}
        >
            <Text>Crear posteo</Text>
        </TouchableOpacity>
      </View>
    )
  }
}