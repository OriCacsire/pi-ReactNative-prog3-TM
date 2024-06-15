import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-web'
import { db, auth } from "../firebase/config"
import firebase from "firebase"


export default class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            estaMiLike: false
        }
    }

    componentDidMount() {
        // console.log('mira',this.props)
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email)
        this.setState({ estaMiLike: estaMiLike })
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
            <View>
                <TouchableOpacity onPress={() => this.irAPerfil()}>
                    <Text>{this.props.post.data.owner}</Text>
                </TouchableOpacity>

                <Text>IMAGEN FALTA</Text>
                <Text>{this.props.post.data.likes.length} likes</Text>
                {
                    this.state.estaMiLike ?
                        <TouchableOpacity
                            onPress={() => this.unlike()}
                        >
                            <Text>Unlike</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.like()}
                        >
                            <Text>Like</Text>
                        </TouchableOpacity>
                }

                <View>
                    <TouchableOpacity onPress={() => this.irAComentar()}>
                        <Text>Comentarios: {this.props.post.data.comments.length} </Text>
                    </TouchableOpacity>

                </View>


            </View>
        )
    }
}
