import React, { Component } from 'react'
import { Text, View, TextInput, FlatList, TouchableOpacity, Picker, StyleSheet} from 'react-native'
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
      <View style={styles.container}>
        {/* componente de react native que me permite seleccionar un valor de la lista (picker.item). Le pasamos el valor actual del buscador, para que cada vez que se cambie la opción de busqueda se actualice. Cpn el onValueChange permite cambiar el criterio de busca. Este recibe un arguemento, asi actualizamos el estado para actualizar el criterio de busqueda en el estado con el nuevo valor ingresado, actulizamos el campo de busqueda a un string vacio, se limpia la lista de usuarios filtrados y se indica que no hay busqueda activa.  */}
       <Picker 
       style = {styles.picker}
       selectedValue = {this.state.filterSearch}
       onValueChange = {(itemValue)=>this.setState({filterSearch:itemValue, searchText:'', user:[], busqueda: false})}
      >
        <Picker.Item label='Nombre' value = 'name'/>
        <Picker.Item label='Email' value = 'owner'/>

       </Picker>
        <TextInput
          style = {styles.textInput}
          placeholder={`Buscar por ${this.state.filterSearch === 'name' ? 'nombre':'email'}`}
          name="busqueda"
          onChangeText={(text) => this.filterUsers(text)}
        />
        {this.state.busqueda === false ?
          <Text style={styles.text}>Ingresa una búsqueda</Text>
          :
          this.state.users.length !== 0 ?
            <FlatList
              data={this.state.users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>
                <View style = {styles.btnSearch}>
                  <TouchableOpacity onPress={() => this.irAPerfil(item.data.owner)}>
                    <Text style = {styles.textBtn}>{this.state.filterSearch === 'name' ? item.data.name : item.data.owner}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    color: '#f0f0f0',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingLeft: 10,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#f0f0f0',
    backgroundColor: '#333',
  },
  text: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 20,
  },
  btnSearch: {
    backgroundColor: '#444',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  textBtn: {
    color: '#f0f0f0',
    fontSize: 16,
  },
});