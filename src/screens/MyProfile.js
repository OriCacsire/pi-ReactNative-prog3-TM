import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';
import firebase from 'firebase';

export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estasLogueado: false,
      posteos: [],
      users:[]
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.setState({ estasLogueado: true });
      db.collection("posteos")
        .where("owner", "==", currentUser.email)
        .onSnapshot((docs) => {
          let posteosObtenidos = [];
          docs.forEach(doc => {
            posteosObtenidos.push({
              id: doc.id,
              data: doc.data()
            });
            console.log(posteosObtenidos);
          });
          this.setState({
            posteos: posteosObtenidos
          });
        });
        db.collection("users").where("owner","==",currentUser.email).onSnapshot((docs)=>{
          let arrayUsers=[];
          docs.forEach(doc=>{
            arrayUsers.push({
              id:doc.id,
              data:doc.data()

            })
            console.log(arrayUsers);
          })
          this.setState({
            users:arrayUsers
          })
        })
    }
    
  }
  

  cerrarSesion() {
    auth.signOut().then(() => {
      this.setState({ estasLogueado: false });
      this.props.navigation.navigate('login');  // Navegar a la pantalla de login después de cerrar sesión
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
         data={this.state.users}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({item} )=> 
        <View>
          {console.log(item)}
          <Text>{item.data.name}</Text>
          
        </View>        }
        />
        <FlatList
          data={this.state.posteos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Post post={item} />}
        />
        <Text>Mi Perfil</Text>
        <TouchableOpacity
          onPress={() => this.cerrarSesion()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});