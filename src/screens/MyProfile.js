import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
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
    return (
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <View style={styles.section}>
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
                <Text style={styles.emptyText}> Este usuario no tiene posteos</Text>
            }
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Mis datos</Text>
            <FlatList
              style={styles.userInfo}
              data={this.state.users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>
                <View style={styles.infoPart}>
                  <Text style={styles.textProfile}>{item.data.name}</Text>
                  {item.data.fotoPerfil != '' ? (
                    <Image
                      source={item.data.fotoPerfil}
                      style={styles.img}
                      resizeMode='contain'
                    />
                  ) : (
                    ''
                  )}
                  <Text style={styles.mail}>{item.data.owner}</Text>
                  {item.data.minbio ? (
                    <Text style={styles.minBio}>
                      {item.data.minibio}
                    </Text>
                  ) : (
                    ''
                  )}
                </View>
              }
            />
          </View>
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
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  userInfo: {
    width: '100%',
  },
  infoPart: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textProfile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  mail: {
    color: '#ccc',
    marginBottom: 5,
  },
  minibio: {
    color: '#ccc',
    marginBottom: 10,
  },
  contenedorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#0056b3',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  postContainer: {
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
});
