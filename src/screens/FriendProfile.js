import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, FlatList } from 'react-native'
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
    console.log('props', this.props) //tenemos navigation y route

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
    return (
      <View style={styles.container}>
        {/* Se crea un FlatList para tener una lista con los posteos*/}
        <View style={styles.infoUserProfile}>
          <FlatList
            //se le pasa el array de datos que se quiere mostrar
            data={this.state.usuarios}
            // recibe una funcion con un parametro que es cada item del array de datos. Esta funcion retorna una pk en texto. Si tenemos un dato numerico tenemos que usar toString()
            keyExtractor={(item) => item.id.toString()}
            // funcion con un objeto literal como parametro y retorna el componente a renderizar. Este item representa a cada uno de los elementos del array de datos.
            renderItem={({ item }) => //console.log(item)
              <View>
                <Text style={styles.username}>Usuario: {item.data.name}</Text>
                {
                  item.data.fotoPerfil != ''
                    ?
                    <Image
                      style={styles.imgUser}
                      source={item.data.fotoPerfil}
                      resizeMode='contain'
                    />
                    :
                    ''
                }
                <Text style={styles.mail}>Email: {item.data.owner}</Text>
                {
                  item.data.minBio ?
                    <Text style={styles.minibio}> Biografía: {item.data.minBio}</Text>
                    :
                    ''
                }
              </View>
            }
          />

        </View>

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
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo oscuro
    padding: 20,
  },
  infoUserProfile: {
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    marginBottom: 10,
    textAlign: 'center', // Centra el texto
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
    textAlign: 'center', // Centra el texto
  },
  minibio: {
    fontSize: 16,
    color: '#eee', // Texto gris claro
    marginBottom: 10,
    textAlign: 'center', // Centra el texto
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