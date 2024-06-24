import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import { db, auth } from "../firebase/config"
import firebase from "firebase"
import Icon from 'react-native-vector-icons/FontAwesome';



export default class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            estaMiLike: false,
            comentarios: []
        }
    }


    componentDidMount() {
        console.log('mira', this.props)
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email)
        this.setState({ estaMiLike: estaMiLike })

        let commentsFiltrados = this.props.post.data.comments.reverse().slice(0, 4) //Primero invierte el orden de modo que quedan de más nuevo a más viejo, despúes corta el array y agarra solo los primeros 4 datos
        this.setState({ comentarios: commentsFiltrados })

    }

    // en este metodo actualizamos el documento correspondiente a este posteo
    like() {
        db.collection("posts").doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then((resp) => this.setState({ estaMiLike: true }))
            .catch((err) => console.log(err))
    }

    unlike() {
        db.collection("posts").doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then((resp) => this.setState({ estaMiLike: false }))
            .catch((err) => console.log(err))
    }

    irAComentar() {
        this.props.navigation.navigate('comments', { id: this.props.post.id })
    }
    irAPerfil() {
        // hay dos casos: si voy a mi perfil y si voy a un perfil de un amigo 
        // post es la props que viene de home. De esta se puede acceder a: data - id 
        {
            this.props.post.data.owner == auth.currentUser.email ?
                this.props.navigation.navigate('MyProfile')
                :
                this.props.navigation.navigate('friendProfile', { user: this.props.post.data.owner })
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.irAPerfil()}>
                    <Text style={styles.ownerText}>{this.props.post.data.owner}</Text>
                </TouchableOpacity>
                <Image
                    style={styles.image}
                    source={{ uri: this.props.post.data.imageUrl }}
                    resizeMode='cover'
                />
                {
                    this.state.estaMiLike ?
                        <TouchableOpacity
                            onPress={() => this.unlike()}
                        >
                            <Text style={styles.textLikes}><Icon name="thumbs-down" size={15} color="#fff" />  {this.props.post.data.likes.length} me gusta</Text>

                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.like()}
                        >
                            <Text style={styles.textLikes}><Icon name="thumbs-up" size={15} color="#fff" />  {this.props.post.data.likes.length} me gusta</Text>

                        </TouchableOpacity>
                }

                <View style={styles.containerComments}>
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        {
                            this.props.post.data.comments.length === 0 ?
                                <Text style={styles.tituloComments}>Sé el primero en comentar</Text>
                                :
                                <Text style={styles.tituloComments}>Ver los {this.props.post.data.comments.length} comentarios </Text>
                        }
                    </TouchableOpacity>
                    <FlatList
                        data={this.state.comentarios}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View>
                                <Text style={styles.textComments}>{item.owner}: {item.text}</Text>
                            </View>
                        }
                    />

                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    image: {
        height: 260,
        marginBottom: 5,
        marginTop: 10
    },
    textLikes: {
        color: '#fff', // Texto blanco,
        fontSize: 12,
        fontWeight: "bold",
        paddingBottom: 5,
        marginLeft: 2
    },
    ownerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5
    },
    containerLikes: {
        marginTop: 5
    },
    containerComments: {
        marginTop: 12,
        marginBottom: 11
    },
    tituloComments: {
        fontSize: 14,
        color: '#9c9c9c', // Texto blanco,
        marginBottom: 10,
        marginLeft:5
    },
    textComments: {
        color: '#fff', // Texto blanco,
        fontSize: 12,
        marginLeft: 2
    },
})