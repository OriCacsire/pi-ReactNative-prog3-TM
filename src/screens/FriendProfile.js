import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
// importo db para crear la coleccion en la que queremos guardar los datos
import { db } from '../firebase/config'

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
        <FlatList
          //se le pasa el array de datos que se quiere mostrar
          data={this.state.usuarios}
          // recibe una funcion con un parametro que es cada item del array de datos. Esta funcion retorna una pk en texto. Si tenemos un dato numerico tenemos que usar toString()
          keyExtractor={(item) => item.id.toString()}
          // funcion con un objeto literal como parametro y retorna el componente a renderizar. Este item representa a cada uno de los elementos del array de datos.
          renderItem={({ item }) => //console.log(item)
            <View>
              <View>
                <Text style={styles.username}>{item.data.name}</Text>
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
                <Text style={styles.mail}>{item.data.owner}</Text>
                {
                  (item.data.minBio) ?
                    <Text style={styles.minibio}>{item.data.minBio}</Text>
                    :
                    ''
                }
              </View>

              <View>
                <Text style={styles.postsTitle}>Posteos de {this.props.route.params.user} </Text>
                <Text style={styles.cantidadPosteos}>Cantidad: {this.state.posteosDelUser.length} </Text>
                <FlatList
                  data={this.state.posteos}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) =>
                    <View style={styles.post}>
                      <Post navigation={this.props.navigation} data={item.data} id={item.id} />
                    </View>
                  }
                />
              </View>
            </View>
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})