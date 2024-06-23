import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { auth,db } from "../firebase/config"
import CameraPost from '../components/CameraPost'

export default class CrearPost extends Component {
  constructor(props){
    super(props)
    this.state = {
        descripcion: "",
        image: ""
    }
  }

  actualizarImgUrl(url) {
    this.setState({
      image: url,
    })
  }

  onSubmit(descripcion){
    if (descripcion !== "") {
        db.collection("posts").add({
            descripcion: descripcion,
            owner: auth.currentUser.email,
            createdAt: Date.now(),
            imageUrl: this.state.image, 
            likes: [],
            comments: []
        })
        .then((resp)=> {
          console.log('Posteo Hecho');
          this.props.navigation.navigate('Home')
          this.setState({
            descripcion:"",
            image:""
          })
        }
        )
        .catch((err) => console.log(err))
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.image == ""?
          <CameraPost
          actualizarImgUrl={(url) => this.actualizarImgUrl(url)}
          />    
        :
        <>
          <Text style={styles.title}>New Post</Text>

          <TextInput
          onChangeText={(text)=> this.setState({descripcion: text})}
          placeholder='Descripción del posteo'
          />
          <TouchableOpacity
          onPress={()=> this.onSubmit(this.state.descripcion)}
          >
              <Text>Crear posteo</Text>
          </TouchableOpacity>
        </>
        }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})