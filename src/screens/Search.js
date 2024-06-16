import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'
import { db } from '../firebase/config'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      users:[], 
      backup:[]
    }
  }

  componentDidMount() { //Trae todos los usuarios y los guarda en 2 arrays
    db.collection("users").onSnapshot(docs => {
      usersArray = []
      docs.forEach(doc => {
        usersArray.push({id: doc.id, data: doc.data()})
      });

      this.setState({
        users: usersArray, 
        backup: usersArray
      })
    })
  }

  filterUsers(text){
    let usersFiltrados = this.state.backup.filter((elm) => 
    elm.data.name.toLowerCase().includes(text.toLowerCase()) //Si es true lo guarda en el array, si es false no
    )
    this.setState({users: usersFiltrados})
    console.log(usersFiltrados);
  }
  
  render() {
    return (
      <View>
        <TextInput
          placeholder='Búsqueda'
          name="busqueda"
          onChangeText={(text) => this.filterUsers(text)}
          />
      </View>
    )
  }
}
