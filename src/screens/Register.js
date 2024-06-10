import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { auth, db } from '../firebase/config'

// Importo componentes:
// import FormRegister from '../components/FormRegister'
// import CameraPost from '../components/CameraPost'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      minBio: '',
      fotoPerfil: '',
      errors: {
        errorName: '',
        errorPassword: '',
        errorMail: '',
      },
      // ¿CREO UN OBJETO LITERAL CON LOS POSIBLES ERRORES ESPECIFICOS?SE PUEDE ?
      mailExite: '',
      // step1: true,
      userId: ''
    }
  }

  onSubmit(email, password, name) {
    if (email === '' || email.includes('@') === false) {
      this.setState({
        errors: {
          errorMail: 'Verifica que el correo electrónico sea válido'
        },
      });
    }
    else if (password === '' || password.length < 6) {
      this.setState({
        errors: {
          errorPassword: 'La contraseña no puede estar vacía y debe tener más de 6 caracteres',
        },
      });
    }
    else if (name === '') {
      this.setState({
        errors: {
          errorName: 'Ingresa un nombre válido'
        },
      });
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        db.collection('users')
          .add({
            owner: this.state.email,
            createdAt: Date.now(),
            name: this.state.name,
            minBio: this.state.minBio,
            fotoPerfil: this.state.fotoPerfil
          })
          .then((resp) => {
            then.setState({
              userId: resp.id,
              email: '',
              password: '',
              name: '',
              minBio: '',
              fotoPerfil: '',
              errors: {
                errorName: '',
                errorPassword: '',
                errorMail: '',
              },
              mailExite: '',
            }, () => this.props.navigation.navigate('TabNav')
            )
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => {
        console.log(err);
        this.setState({ mailExite: err.message })
      })
  }

  actualizarImgUrl(url) {
    this.setState({
      fotoPerfil: url,
      // 
    })
  }

  mostrar
  render() {
    return (
      <View style={styles.container}>
        {/* {
          this.state.fotoPerfil === ''
            ?
            // <CameraPost />

            : */}
            <View>
              <Text> Registrate en nuestra página</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder='Ingresar correo electrónico'
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({ email: text, errorMail: '' })}
                  value={this.state.email}
                />
                {this.state.errors.errorMail !== ''
                  ?
                  <Text>{this.state.errors.errorMail}</Text>

                  :
                  ''
                }
                {this.state.mailExite !== ''
                  ?
                  <Text>{mailExite}</Text>

                  :
                  ''
                }

                <TextInput
                  style={styles.input}
                  placeholder="Ingresa una contraseña"
                  keyboardType="defaul"
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({ password: text, errorPassword: '' })}
                  value={this.state.password}
                />
                {
                  this.state.errors.errorPassword !== ''
                    ?
                    <Text>{errors.errorPassword}</Text>
                    :
                    ''
                }
                <TextInput
                  style={styles.input}
                  keyboardType='default'
                  placeholder='Nombre de usuario'
                  onChangeText={(text) => this.setState({ name: text, errorName: '' })}
                  value={this.state.name}
                />

                {this.state.errors.errorName !== ''
                  ?
                  <Text>{this.state.errors.errorName}</Text>
                  :
                  ''
                }

                <TextInput
                  style={styles.input}
                  placeholder="Crea una minibio"
                  keyboardType="default"
                  value={this.state.minBio}
                  onChangeText={(text) => this.setState({
                    minBio: text,
                  })
                  }
                />

                <Text style={styles.textLink}>
                  ¿Ya tienes una cuenta?
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}
                  >
                    <Text style={styles.link}> Inicia sesión </Text>
                  </TouchableOpacity>
                </Text>

                {this.state.email === '' || this.state.password === '' || this.state.name === ''
                  ?
                  ''
                  :
                  <View>
                    <TouchableOpacity
                      style={styles.btn}

                      onPress={() => this.onSubmit(this.state.email, this.state.password, this.state.name)}

                    >
                    <Text style ={styles.text.Btn}>Regístrame</Text>
                    </TouchableOpacity>

                  </View>
                }

              </View>
            </View>
        {/* } */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#9fc1ad',
    textAlign: 'center'
  },
})
export default Register