import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, FlatList, ScrollView } from 'react-native'
// importo db para crear la coleccion en la que queremos guardar los datos
import { db, auth } from '../firebase/config'

//importo componente de posteos 
import Post from '../components/Post'

export default class FriendProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      usuarios: [],
      posteosDelUser: [],
    }
  }

  componentDidMount() {
    //Verificación usuario logueado
    auth.onAuthStateChanged((user)=>{
      if(user === null){
        this.props.navigation.navigate('login')
      }
    });
    
    console.log('props', this.state.usuarios) //tenemos navigation y route

    db.collection('users')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrDocs = []
        docs.forEach((doc) => {
          arrDocs.push({
            id: doc.id,
            data: doc.data()
          })
        })
        this.setState({
          usuarios: arrDocs
        },
          () => console.log(this.state.usuarios))
      }
      )
    db.collection('posts')
      .where('owner', '==', this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrPost = []
        docs.forEach((doc) => {
          arrPost.push({
            id: doc.id,
            data: doc.data()
          })
          console.log(arrPost)
        })

        this.setState({
          posteosDelUser: arrPost
        },
          () => console.log('log extendido', this.state))
      }
      )

  }

  render() {
    const user = this.state.usuarios.length > 0 ? this.state.usuarios[0].data: null ;
    
    return (
      
      <ScrollView style={styles.container}>
        {
          user ?
            <View style={styles.infoUser}>
              <Text style={styles.username}>Usuario: {user.name}</Text>
              <Image
                style={styles.imgUser}
                source={{ uri: user.fotoPerfil }}
                resizeMode='contain'
              />
              <Text style={styles.mail}>Email: {user.owner}</Text>
              <Text style={styles.minibio}> Biografía: {user.minBio}</Text>

            </View>
            :
            <Text>Cargando...</Text>
        }
       
        <View style={styles.postsUser}>
          <Text style={styles.postsTitle}> Cantidad de Postos:{this.state.posteosDelUser.length} </Text>
          {
            this.state.posteosDelUser.length === 0
              ?
              <Text>El usuario no tiene posteos</Text>
              :
              <FlatList
                data={this.state.posteosDelUser}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  <View style={styles.post}>
                    <Post navigation={this.props.navigation} post={item} />
                  </View>
                }
              />
          }

        </View>
      </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo oscuro
    padding: 20,
  },
  infoUser: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    marginBottom: 10,
  },
  imgUser: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff', // Borde blanco para destacar la imagen
  },
  mail: {
    fontSize: 16,
    color: '#ccc', // Texto gris claro
    marginBottom: 10,
  },
  minibio: {
    fontSize: 16,
    color: '#eee', // Texto gris claro
    marginBottom: 10,
  },
  postsUser: {
    flex: 1,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    marginBottom: 10,
    textAlign: 'center', // Centra el texto
  },
  cantidadPosteos: {
    fontSize: 16,
    color: '#ccc', // Texto gris claro
    marginBottom: 10,
    textAlign: 'center', // Centra el texto
  },
  post: {
    marginBottom: 20,
  },
});
