import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Camera } from 'expo-camera'
import { storage } from '../firebase/config'

class CameraPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dioPermiso: false,
      urlTemporal: ''
    }
    this.metodoCamara = null
  }

  componentDidMount() {
    Camera.requestCameraPermissionsAsync()
      .then(() => this.setState({ dioPermiso: true }))
      .catch(() => this.setState({ dioPermiso: false }))
  }

  tomarFoto() {
    this.metodoCamara.takePictureAsync()
      .then((urlTemp) => this.setState({ urlTemporal: urlTemp.uri }))
      .catch((err) => console.log(err))
  }

  guardarFotoEnFirebase() {
    fetch(this.state.urlTemporal)
      .then((img) => img.blob())
      .then((imgProcesada) => {
        const ref = storage.ref(`foto/${Date.now()}.jpeg`)
        ref.put(imgProcesada)
        .then((url) => {
          ref.getDownloadURL()
            .then((url) => this.props.actualizarImgUrl(url))

        })

      })
      .catch((err) => console.log(err))
  }

  descartarFoto() {
    this.setState({
      urlTemporal: ''
    })
  }
  render() {
    return (
      <View style={styles.contenedor}>
        {
          this.state.dioPermiso
            ?
            this.state.urlTemporal === ''
              ?
              <View style={styles.contenedor}>

                <Camera
                  style={styles.camara}
                  ref={(metodos) => this.metodoCamara = metodos}
                  type={Camera.Constants.Type.back}
                />
                <TouchableOpacity
                  onPress={() => this.tomarFoto()}
                >
                  <Text>Tomar foto</Text>
                </TouchableOpacity>

              </View>

              :
              <View>
                <Image
                  style={styles.imagen}
                  source={{ uri: this.state.urlTemporal }}
                />
                <TouchableOpacity
                  onPress={() => this.descartarFoto()}
                >
                  <Text>Rechazar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.guardarFotoEnFirebase()}
                >
                  <Text>Aceptar foto</Text>
                </TouchableOpacity>

              </View>
            :
            <Text>No diste permisos para usar la Camara</Text>
        }


      </View>
    )
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1
  },
  camara: {
    height: 400
  },
  imagen: {
    height: 400,
    width: '100%'
  }
})
export default CameraPost