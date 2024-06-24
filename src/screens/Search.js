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
      filterSearch:'name', //para elegir como buscar
      searchText:'' //este es el texto que aparece al comienzo
    }
  }

  componentDidMount() { //Trae todos los usuarios y los guarda en 2 arrays
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
        {/* componente de react native que me permite seleccionar un valor de la lista (picker.item). Le pasamos el valor actual del buscador, para que cada vez que se cambie la opción de busqueda se actualice. Cpn el onValueChange permite cambiar el criterio de busca. Este recibe un arguemento, asi actualizamos el estado para actualizar el criterio de busqueda en el estado con el nuevo valor ingresado, actulizamos el campo de busqueda a un string vacio, se limpia la lista de usuarios filtrados y se indica que no hay busqueda activa.  */}
       <Picker 
       selectedValue = {this.state.filterSearch}
       onValueChange = {(itemValue)=>this.setState({filterSearch:itemValue, searchText:'', user:[], busqueda: false})}
      >
        <Picker.Item label='Nombre' value = 'name'/>
        <Picker.Item label='Email' value = 'owner'/>

       </Picker>
        <TextInput
          placeholder={`Buscar por ${this.state.filterSearch === 'name' ? 'nombre':'email'}`}
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
                    <Text>{this.state.filterSearch === 'name' ? item.data.name : item.data.owner}</Text>
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
