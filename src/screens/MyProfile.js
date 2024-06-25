import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView } from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';

export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estasLogueado: false,
      posteos: [],
      users: [],
      eliminarPost: false
    };
  }

  componentDidMount() {
    //Verificación usuario logueado
    auth.onAuthStateChanged((user) => {
      if (user === null) {
        this.props.navigation.navigate('login')
      }
    });

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
      db.collection("users")
        .where("owner", "==", currentUser.email)
        .onSnapshot((docs) => {
          let arrayUsers = [];
          docs.forEach(doc => {
            arrayUsers.push({
              id: doc.id,
              data: doc.data()
            })
          })
          this.setState({
            users: arrayUsers
          })
        })
    }

  }

  eliminarPost(postId) {
    db.collection("posts")
      .doc(postId)
      .delete()

  }
  cerrarSesion() {
    auth.signOut()
      .then(() => {
        this.setState({ estasLogueado: false });
        this.props.navigation.navigate('login');  // Navegar a la pantalla de login después de cerrar sesión
      }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  eliminarUsuario() {
    db.collection("users").where("owner", "==", auth.currentUser.email).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => doc.ref.delete() //Elimina al usuario de la colección
          .then(() => {
            auth.currentUser.delete() //Elimina al usuario del auth
              .then(() => this.props.navigation.navigate('register'))
              .catch((error) => console.log("Error al eliminar al usuario del auth", error))
          })
          .catch((error) => console.log("Error al eliminar al usuario de la colección", error))
        )
      })
      .catch((error) => console.log("Error al acceder a la colección", error))

  }

  render() {
    const user = this.state.users.length > 0 ? this.state.users[0].data : null;
    return (
      <ScrollView style={styles.container}>
        {
          user ?
            <View style={styles.userInfo}>
              <Text style={styles.title}>{user.name}</Text>
              {
                user.fotoPerfil === ""
                  ?
                  <Image
                    source={{ uri: "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg" }}
                    style={styles.imgPerfil}
                    resizeMode='contain'
                  />
                  :
                  <Image
                    source={{ uri: user.fotoPerfil }}
                    style={styles.imgPerfil}
                    resizeMode='contain'
                  />
              }
              <Text style={styles.mail}>{user.owner}</Text>
              <Text style={styles.minBio}>{user.minBio}</Text>

              <View style={styles.postUser}>
                <Text style={styles.title}>Tus Posteos:{this.state.posteos.length}</Text>
                {
                  this.state.posteos.length > 0
                    ?
                    <View style={styles.listPost}>
                      <FlatList
                        data={this.state.posteos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) =>
                          <View style={styles.postContainer}>
                            <Post post={item} />
                            <TouchableOpacity style={styles.deleteButton} onPress={() => this.eliminarPost(item.id)}>
                              <Text style={styles.buttonText}> Eliminar posteo</Text>
                            </TouchableOpacity>
                          </View>
                        }
                      />
                    </View>
                    :
                    <Text style={styles.emptyText}> El usuario no tiene posteos</Text>
                }

              </View>

              <View style={styles.contenedorBtn}>
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
            </View>
            :
            ''
        }



      </ScrollView >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo oscuro
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    marginBottom: 10,
    textAlign: 'center',
  },
  imgPerfil: {
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
    textAlign: 'center',
  },
  minBio: {
    fontSize: 16,
    color: '#eee', // Texto gris claro
    marginBottom: 10,
    textAlign: 'center',
  },
  postUser: {
    flex: 1,
  },
  listPost: {
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#2a2a2a', // Fondo oscuro para los contenedores de los posts
    padding: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4444', // Botón de eliminar rojo
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#ccc', // Texto gris claro
    textAlign: 'center',
    marginTop: 20,
  },
  contenedorBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff', // Botón azul
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
});

