import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'
import { auth, db } from "../firebase/config"
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
      <View style={styles.container}>
        <Text style={styles.postsTitle} >Home</Text>
        <View style={styles.flatlist} >
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
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flatlist: { //Es un fix para FlatList q aveces no permite scrollear
    width: "100%",
    flex: 1
  }, 
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo oscuro
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco,
    paddingVertical: 5,
    marginVertical: 15,
    textAlign: 'center', // Centra el texto
  },
 
  

})
