import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { auth, db } from "../firebase/config"
import CameraPost from '../components/CameraPost'

export default class CrearPost extends Component {
  constructor(props) {
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

  onSubmit(descripcion) {
    if (descripcion !== "") {
      db.collection("posts").add({
        descripcion: descripcion,
        owner: auth.currentUser.email,
        createdAt: Date.now(),
        imageUrl: this.state.image,
        likes: [],
        comments: []
      })
        .then((resp) => {
          console.log('Posteo Hecho');
          this.props.navigation.navigate('Home')
          this.setState({
            descripcion: "",
            image: ""
          })
        }
        )
        .catch((err) => console.log(err))
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.image == "" ?
            <CameraPost
              actualizarImgUrl={(url) => this.actualizarImgUrl(url)}
            />
            :
            <>
              <Text style={styles.title}>New Post</Text>

              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({ descripcion: text })}
                placeholder='Descripción del posteo'
              />
              <TouchableOpacity
                onPress={() => this.onSubmit(this.state.descripcion)}
              >
                <Text style={styles.whiteText}>Crear posteo</Text>
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
    backgroundColor: '#1a1a1a', // Fondo oscuro
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f0f0f0', // Texto claro
    alignItems:'center'
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#f0f0f0', // Texto claro
    backgroundColor: '#333', // Fondo oscuro
  },
  btnCrearPost: {
    backgroundColor: '#444', // Fondo oscuro
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textBtnCrearPost: {
    color: '#f0f0f0', // Texto claro
    fontWeight: 'bold',
  },
  whiteText: {
    color: '#fff', // Texto blanco
  }
})