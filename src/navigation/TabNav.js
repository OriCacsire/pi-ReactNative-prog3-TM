import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome } from '@expo/vector-icons'

import Home from '../screens/Home'
import CrearPost from '../screens/CrearPost'
import MyProfile from '../screens/MyProfile'
import Search from '../screens/Search'


const Tab = createBottomTabNavigator()

export default class TabNav extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name='Home'
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name='home' size={24} color='black' />
          }}
        />


        <Tab.Screen
          name='Crear post' //tener en cuenta
          component={CrearPost}
          options={{
            headerShown: false,
            tabBarIcon: () => <FontAwesome name="edit" size={24} color="black" />

          }} />

        <Tab.Screen
          name= 'Search'
          component={Search}
          options={{
            headerShown:false,
            tabBarIcon:()=> <FontAwesome name="search" size={24} color="black" />
          }}
        />

        <Tab.Screen
        name='My profile'
        component={MyProfile}
        options={{
          headerShown:false,
          tabBarIcon:() => <FontAwesome name="user-circle-o" size={24} color="black" />
        }}
        />
      </Tab.Navigator>
    )
  }
}
