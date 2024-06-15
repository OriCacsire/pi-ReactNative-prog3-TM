import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { auth, db } from "../firebase/config"
import { FlatList } from 'react-native-web'
import Post from '../components/Post'

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        // metodo collecion recibe como parametro el nombre de una colección. Con .onSnapshot se obtiene todos los doc de la coleccion y los coloca en el parametro docs
        db.collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((docs) => {

        let postsObtenidos = []
        // se guardan los datos que pasaremos al estado del componente.Con el forEach vamos a recorres el array de documentos y pusheamos un OBJETO LITERAL con el id de cada documento y la informacion del documento q se obtiene con el metodo data()
        docs.forEach((doc)=>{
          postsObtenidos.push({
            id: doc.id,
            data: doc.data()
          })
        })
        this.setState({
          // Se guardan los datos en el estado del componente que renderizara los postos dentro de la FlatList
          posts: postsObtenidos
        })       
      })
      }
    })
  }


  render() {
    return (
      <View>
        <Text>Home</Text>
        <FlatList
        data = {this.state.posts}
        keyExtractor = {(item) => item.id.toString()}
        renderItem = {
          ({item}) => 
            <View>
              {/* Para poder redirigir a mi perfil/perfil usuario/comentarios en post se necesita tener como props navigation */}
              <Post  navigation={this.props.navigation} post = {item}/>
            </View>

        }
        />
      </View>
    )
  }
}
