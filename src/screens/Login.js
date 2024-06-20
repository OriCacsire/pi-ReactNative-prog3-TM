import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import { auth } from '../firebase/config'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {
        errorMail: '',
        errorPassword: '',
      },
      mailExiste: "",

    }
  }

  // Verificar si el usuario esta logueado
  componentDidMoun() {
    // observa los datos obtenidos del usuario
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Mail del usuario logueado', auth.currentUser.email);
      }
    })
  }

  onSubmit(email, password) {
    if (email === null || email === "" || !email.includes("@")) {
      this.setState({
        errors: {
          errorMail: 'Verifica que el correo electrónico sea válido', 
        }, loading: false
      })
      return false;
    }
    if (password === null || password === "" || password.length < 6) {
      this.setState({
        errors: {
          errorPassword: 'La contraseña no puede estar vacía y debe tener más de 6 caracteres'
        },
        loading: false
      })
      return false;
    }
    this.setState({ loading: true, errorMail: '', errorPassword: ''});

    auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Entro en el then')
        this.props.navigation.navigate('tabNav')
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log('error en el catch', err);
        this.setState({
          errors: {
            errorMail: '',
            errorPassword: '',
          },
          loading: false,
        });
        if (err.code === 'auth/internal-error') {
          this.setState({ error: 'Credenciales invalidas' })
        }
      })

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Logueate en nuestra página</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-addres"
          placeholder="Ingrese su email aqui"
          onChangeText={(text) => this.setState({ email: text, errorMail: '' })}
          value={this.state.email}
        />
        {this.state.errors.errorMail !== ''
          ?
          <Text style={styles.errorText}>{this.state.errors.errorMail}</Text>
          :
          ''
        },
        {this.state.mailExiste !== ''
          ?
          <Text style={styles.errorText}>{this.state.mailExiste}</Text>
          :
          ''
        }
        <TextInput
          style={styles.input}
          keyboardType="password"
          placeholder="Ingrese su contraseña aqui"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text, errorPassword: '' })}
          value={this.state.password}
        />
        {
          this.state.errors.errorPassword !== ''
            ?
            <Text style={styles.errorText}>{this.state.errors.errorPassword}</Text>
            :
            ''
        }

        <Text style={styles.textLink}>
          ¿No tienes una cuenta?
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('register')}
          >
            <Text style={styles.link}> Registrate</Text>
          </TouchableOpacity>
        </Text>

        {this.state.email === '' || this.state.password === ''
          ?
          ''
          :
          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.onSubmit(this.state.email, this.state.password)}
              disabled={this.state.loading}
            >
              {this.state.loading === true ? (
                <ActivityIndicator size='large' color="white" />
              ) : (
                <Text style={styles.textBtn}> Loguearme </Text>

              )}
            </TouchableOpacity>

          </View>
        }

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
    marginTop: 23
  },
  link: {
    color: '#4d90fe',
  },
  // falta usar porque aun no estan 
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
})