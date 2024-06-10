import React, { Component } from 'react'
import { LogBox, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-web'
import { db, auth } from "../firebase/config"
import firebase from "firebase"

export default class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            estaMiLike: false
        }
    }

    componentDidMount(){
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email)
        this.setState({estaMiLike: estaMiLike})
    }

    like(){
        db.collection("posts").doc(this.props.post.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=> this.setState({estaMiLike: true}))
        .catch((err)=> console.log(err))
    }

    unlike(){
        db.collection("posts").doc(this.props.post.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(()=> this.setState({estaMiLike: false}))
        .catch((err)=> console.log(err))
    }

  render() {
    return (
      <View>
        <Text> {this.props.post.data.owner} </Text>
        <Text> IMAGEN FALTA </Text> 
        <Text>{this.props.post.data.likes.length} likes</Text>
        {
            this.state.estaMiLike ? 
            <TouchableOpacity
            onPress={()=>this.unlike()}
            >
                <Text>Unlike</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
            onPress={()=>this.like()}
            >
                <Text>Like</Text>
            </TouchableOpacity>
        }
        
        <Text>{this.props.post.data.likes.length} comments</Text>

      </View>
    )
  }
}
