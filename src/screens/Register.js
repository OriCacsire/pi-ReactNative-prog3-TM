import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { auth, db } from '../firebase/config'

// Importo componentes: 
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
      loading: false,
      errorName: '',
      errorPassword: '',
      errorMail: '',
      mailExiste: '',
      userRegistrado: false,
      userId: '',
    }
  }

  componentDidMount(){
    //es a login para que luego de subir la foto vaya a login y no a home
    auth.onAuthStateChanged((user)=>{
      if(user){
        this.props.navigation.navigate('login')
      }
    });
  }
  
  onSubmit(email, password, name) {
    if (email === null || email === '' || email.includes('@') === false) {
      this.setState({
          errorMail: 'Verifica que el correo electrónico sea válido', loading: false
      });
      return false;
    }
    else if (password === null || password === '' || password.length < 6) {
      this.setState({
          errorPassword: 'La contraseña no puede estar vacía y debe tener más de 6 caracteres', loading: false
      });
      return false;
    }
    else if (name === null || name === '' || name.length < 6) {
      this.setState({
        errorName: 'Ingresa un nombre válido', loading:false
      });
      return false;
    }

    this.setState({ loading: true, errorName: '', errorPassword: '', errorMail: '' });
    
    //permite registrar al usuario
    auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('usuario registrado')
        this.setState({ userRegistrado: true })
        db.collection('users').add({
          owner: this.state.email,
          createdAt: Date.now(),
          name: this.state.name,
          minBio: this.state.minBio,
          fotoPerfil: this.state.fotoPerfil
        })
          .then((resp) => {
            console.log('respuesta al crear el documento en la coleccion users', resp)
            this.setState({
              userId: resp.id,
              email: '',
              password: '',
              name: '',
              minBio: '',
              fotoPerfil: '',
              errorName: '',
              errorPassword: '',
              errorMail: '',
              loading: false,
              mailExiste: '',
            }, () => console.log('log del estado', this.state)
            )
            this.props.navigation.navigate('cargarFotoPerfil',{userId:resp.id})
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => {
        console.log(err);
        this.setState({ mailExiste: err.message, loading: false })
      })
  }


  render() {
    return (
      <View style={styles.container}>
      
          <View>
            <Text style={styles.title}>Registrate en nuestra página</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder='Ingresar correo electrónico'
                keyboardType="email-address"
                onChangeText={(text) => this.setState({ email: text, errorMail: '', mailExiste: '' })}
                value={this.state.email}
              />
              {this.state.errorMail !== ''
                ?
                <Text style={styles.errorText}>{this.state.errorMail}</Text>
                :
                ''
              }
              {this.state.mailExiste !== ''
                ?
                <Text style={styles.errorText}>{this.state.mailExiste}</Text>
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
                this.state.errorPassword !== ''
                  ?
                  <Text style={styles.errorText}>{this.state.errorPassword}</Text>
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

              {this.state.errorName !== ''
                ?
                <Text style={styles.errorText}>{this.state.errorName}</Text>
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
                  onPress={() => this.props.navigation.navigate('login')}
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
                    disabled={this.state.loading}
                  >
                    {this.state.loading === true ? (
                        <ActivityIndicator size='large' color="white" />
                    ) : (
                      <Text style={styles.textBtn}>Regístrame</Text>

                    )}
                  </TouchableOpacity>

                </View>
              }

            </View>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    textAlign: 'center'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#f0f0f0',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 24,
    padding: 10,
    borderRadius: 8,
    color: '#f0f0f0',
    backgroundColor: '#333',
  },
  btn: {
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textBtn: {
    color: '#f0f0f0',
    fontWeight: 'bold',
  },
  textLink: {
    marginBottom: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f0f0',
    textAlign: 'center',
  },
  link: {
    color: '#4d90fe',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
})
export default Register