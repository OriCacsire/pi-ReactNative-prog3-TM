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

  // aceptar foto y guardar
  guardarFotoEnFirebase() {
    fetch(this.state.urlTemporal)
      .then((img) => img.blob())
      .then((imgProcesada) => {
        const ref = storage.ref(`foto/${Date.now()}.jpg`)
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
                  style={styles.button}
                  onPress={() => this.tomarFoto()}
                >
                  <Text style={styles.buttonText}>Tomar foto</Text>
                </TouchableOpacity>

              </View>

              :
              <View style={styles.previewContainer}>
                <Image
                  style={styles.imagen}
                  source={{ uri: this.state.urlTemporal }}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.descartarFoto()}
                >
                  <Text style={styles.buttonText} >Rechazar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.guardarFotoEnFirebase()}
                >
                  <Text style={styles.buttonText}>Aceptar foto</Text>
                </TouchableOpacity>

              </View>
            :
            <Text style={styles.permissionText}>No diste permisos para usar la Camara</Text>
        }


      </View>
    )
  }
}
// mejorar el estilo falta acomodar. Mejorar luego
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  camara: {
    height: 400,
    width: '100%',
  },
  imagen: {
    height: 400,
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#000',
    fontSize: 16,
  },
})
export default CameraPost