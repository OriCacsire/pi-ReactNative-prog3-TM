import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import { db, auth } from '../firebase/config'
import firebase from 'firebase'

// importo componente pinchooo
// import FormComments from '../components/FormComments'

export default class Comments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arrComments: [],
      comentarios: "",
    }
  }

  componentDidMount() {

    // console.log('props', this.props)
    db.collection('posts')
      .doc(this.props.route.params.id)
      // .orderBy('createdAt', 'asc')

      .onSnapshot((doc) => {
        this.setState({
          arrComments: doc.data().comments // Accede a la propiedad 'comments' de los datos del documento
            ? // Operador ternario que evalúa si 'comments' existe
            doc.data().comments.sort((a, b) => b.createdAt - a.createdAt) // Si 'comments' existe, ordena los comentarios por 'createdAt' en orden descendente
            : [] // Si 'comments' no existe, establece 'arrComments' como un array vacío
        },
          // () => console.log(this.state)
        );
      });

  }

  enviarComentario(texto) {
    // se guarda el comentario en la coleccion creada en post. Para crear el comentario en firestore usamos el update para que se vaya guardando y acutalizado 
    db.collection('posts')
      .doc(this.props.route.params.id)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          text: texto //otra forma es poner : this.state.texto sin enviar parametro
        }),
      })
      .then(() => {
        this.setState({ texto: '' })
      })
      .catch((error) => console.log(error))
  }


  regresar() {
    this.props.navigation.navigate('Home'); //, luego veo{ id: this.props.post.id }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Agregar logo pag */}
        {/* <Image source={require('../../assets/splas')} /> */}
        <Text Style={styles.title}> Comentarios </Text>
        {
          this.state.arrComments.length === 0 ? (
            <Text style={styles.noComments}>Aún no hay comentarios</Text>
          )
            : (
              <FlatList
                data={this.state.arrComments}
                keyExtractor={(item) => item.createdAt.toString()}
                renderItem={({ item }) => (
                  <View style={styles.containerComment}>
                    <Text style={styles.infoComment}>{item.owner}:{item.text} </Text>
                  </View>
                )}
              />
            )

        }
        <View style={styles.container}>
          <TextInput
            placeholder='Agregar tu comentario'
            keyboardType='default'
            onChangeText={(text) => this.setState({ texto: text })}
            value={this.state.texto}
            multiline={true}
            numberOfLines={4}
            style={styles.inputText}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.enviarComentario(this.state.texto)}>
            <Text style={styles.btnText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.returnButton} onPress={() => this.regresar()}>
            <Text style={styles.regresoBtn}>Regresar</Text>
          </TouchableOpacity>

        </View>


      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  containerComment: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  infoComment: {
    fontSize: 16,
  },
  owner: {
    fontWeight: 'bold',
    color: '#333',
  },
  inputText: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  regresoBtn: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});