import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet ,Image} from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';
import firebase from 'firebase';

export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estasLogueado: false,
      posteos: [],
      users:[],
      eliminarPost: false
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.setState({ estasLogueado: true });
      db.collection("posts")
        .where("owner", "==", currentUser.email)
        .onSnapshot((docs) => {
          let posteosObtenidos = [];
          docs.forEach(doc => {
            posteosObtenidos.push({
              id: doc.id,
              data: doc.data()
            });
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
          })
          this.setState({
            users:arrayUsers
          })
        })
    }
    
  }
  eliminarPost(postId){
    db.collection("posts")
    .doc(postId)
    .delete()
    
}
  cerrarSesion() {
    auth.signOut().then(() => {
      this.setState({ estasLogueado: false });
      this.props.navigation.navigate('login');  // Navegar a la pantalla de login después de cerrar sesión
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  eliminarUsuario(){
    
    db.collection("users").where("owner", "==", auth.currentUser.email).get()
    .then((querySnapshot)=> {
      querySnapshot.forEach((doc) => doc.ref.delete() //Elimina al usuario de la colección
      .then(()=>{
        auth.currentUser.delete() //Elimina al usuario del auth
        .then(()=> this.props.navigation.navigate('register')) 
        .catch((error) => console.log("Error al eliminar al usuario del auth", error))
      })
      .catch((error) => console.log("Error al eliminar al usuario de la colección", error))
      )
    })
    .catch((error)=> console.log("Error al acceder a la colección", error))

  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
         data={this.state.users}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({item} )=> 
        <View>
          <Text>{item.data.name}</Text>
          <Text>{item.data.minibio}</Text>
            {item.data.fotoPerfil != '' ? (
            <Image
                    source={item.data.fotoPerfil}
                  />
                ) : (
                  ''
                )}
            {item.data.minBio ? (
                  <Text >
                     {item.data.minibio}
                  </Text>
                ) : (
                  ''
                )}
        <Text>{item.data.owner}</Text>
        </View>        }
        />
        <FlatList
          data={this.state.posteos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => 
          <View>
            <Post post={item} />
            <TouchableOpacity onPress={()=>this.eliminarPost(item.id)}>
              <Text>Eliminar posteo</Text>
            </TouchableOpacity>
          </View>}
        />
        <Text>Mi Perfil</Text>
        <TouchableOpacity
          onPress={() => this.cerrarSesion()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.eliminarUsuario()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Eliminar usuario</Text>
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