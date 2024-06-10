import {Text,View} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Importamos los components y Screens
import TabNav from './TabNav';
import Register from '../screens/Register';
import Login from '../screens/Login';

const Stack = createNativeStackNavigator();


export default function MainNav() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name = 'Register'
                component={Register}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name = 'Login'
                component={Login}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name = 'TabNav'
                component={TabNav}
                options={{headerShown:false}}
            />
            {/* crear otros para: comentarios - perfil del usuario - cambiar contraseña - editar perfil */}


        </Stack.Navigator>
    </NavigationContainer>


    )
}
