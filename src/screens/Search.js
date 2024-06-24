import React, { Component } from 'react'
import { Text, View, TextInput, FlatList, TouchableOpacity, Picker} from 'react-native'
import { db, auth } from '../firebase/config'


export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      backup: [],
      busqueda: false,
      // estado para el filtrar la busqueda
      filterSearch:'name'
  
    }
  }

  componentDidMount() {
    //Verificación usuario logueado
    auth.onAuthStateChanged((user)=>{
      if(user === null){
        this.props.navigation.navigate('login')
      }
    });

    //Trae todos los usuarios y los guarda en 2 arrays
    db.collection("users").onSnapshot(docs => {
      let usersArray = []
      docs.forEach(doc => {
        usersArray.push({ id: doc.id, data: doc.data() })
      });

      this.setState({
        backup: usersArray
      })
    })
  }

  filterUsers(text) {
    if (text !== "") {
      let usersFiltrados = this.state.backup.filter((elm) =>
        elm.data.name.toLowerCase().includes(text.toLowerCase()) //Si es true lo guarda en el array, si es false no
      )
      this.setState({ users: usersFiltrados, busqueda: true })
    }
    else {
      this.setState({ users: [], busqueda: false })
    }
  }

  irAPerfil(user) {
    // hay dos casos: si voy a mi perfil y si voy a un perfil de un amigo 
    // post es la props que viene de home. De esta se puede acceder a: data - id 
    {
      user == auth.currentUser.email ?
        this.props.navigation.navigate('MyProfile')
        :
        this.props.navigation.navigate('friendProfile', { user: user })
    }

  }

  render() {
    return (
      <View >
        <Picker>
          {/* utilizar metodos de la pag para el buscador avanzado  */}
        </Picker>
        <TextInput
          placeholder='Búsqueda'
          name="busqueda"
          onChangeText={(text) => this.filterUsers(text)}
        />
        {this.state.busqueda === false ?
          <Text>Ingresa una búsqueda</Text>
          :
          this.state.users.length !== 0 ?
            <FlatList
              data={this.state.users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>
                <View>
                  <TouchableOpacity onPress={() => this.irAPerfil(item.data.owner)}>
                    <Text>{item.data.owner}</Text>
                    <Text>{item.data.name}</Text>
                  </TouchableOpacity>
                </View>
              }
            />
            :
            <Text>No se encontraron usuarios</Text>
        }




      </View>
    )
  }
}
