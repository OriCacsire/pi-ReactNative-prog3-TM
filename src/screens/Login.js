import React, { Component } from 'react'
import { Text, View,TouchableOpacity ,StyleSheet,TextInput} from 'react-native'
import { auth } from '../firebase/config'

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state={
      email : "",
      password:"",
      error:"",
      mailExiste:"",
    }

  }
  onSubmit(email,password){
    if (email===null || email===""||!email.includes("@")) {
      this.setState({error : "el email tiene un formato invalido"})
      console.log(error);
      return false
    }
    if (password===null || password==="") {
      this.setState({error : "contrañea incorrecta"})
      return false
    }
    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('Entro en el then')
        this.props.navigation.navigate('tabNav')
    })
    .catch(err => {
      console.log('error en el catch', err)
        if(err.code === 'auth/internal-error'){
            this.setState({error: 'Credenciales invalidas'})
        }
    })

}

  
  
  render() {
    return (
      <View>
        <TextInput 
        keyboardType= "email-addres"
        placheholder="ingrese su email aqui"
        onChangeText={(text) => this.setState({ email: text, error: '' })}
        value={this.state.email}
        />
        <TextInput 
        keyboardType= "password"
        placheholder="ingrese su contraseña aqui"
        secureTextEntry={true}
        onChangeText={(text) => this.setState({ password: text, error: '' })}
        value={this.state.password}
        />
        <TouchableOpacity
                    onPress={()=> this.onSubmit(this.state.email, this.state.password)}
                >
                    <Text >Loguearme</Text>
        </TouchableOpacity>
          <TouchableOpacity  onPress={()=> this.props.navigation.navigate("register")}>
            <Text>register</Text>
          </TouchableOpacity>
      </View>
    )
  }}