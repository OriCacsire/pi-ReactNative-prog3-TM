import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { auth, db } from "../firebase/config"
import { FlatList } from 'react-native-web'

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged(user)
    if (user) {
      db.collection("posts").order("createdAt", "desc").onSnapshot(docs)

      let postsObtenidos = []

      docs.forEach((doc)=>{
        postsObtenidos.push({
          id: doc.id,
          data: doc.data()
        })
      })
      
    }
  }


  render() {
    return (
      <View>
        <FlatList
        data = {this.state.posts}
        keyExtractor = {(item) => item.id.toString()}
        renderItem = {
          ({item}) => 
            <View>
              <Post post = {item}/>
            </View>

        }
        />
      </View>
    )
  }
}
