import { Text, View } from 'react-native'
// Importamos el contenedor y el tipo de menu
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// vistas que son parte de la navegacion
import Register from '../screens/Register';
import Login from '../screens/Login';
import Comments from '../screens/Comments';
import FriendProfile from '../screens/FriendProfile';

import TabNav from './TabNav';

//** */ vista para electiva
import EditProfileScreen from '../screens/EditProfileScreen';

// Se guarda en una variable la ejecucion de createNativeStackNavigator
const Stack = createNativeStackNavigator();

function MainNav() {

    return (
        <NavigationContainer> 
            <Stack.Navigator>
                <Stack.Screen
                    name='register'
                    component={Register}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='login'
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='tabNav'
                    component={TabNav}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='comments'
                    component={Comments}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='friendProfile'
                    component={FriendProfile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='editProfileScreen'
                    component={EditProfileScreen}
                />
                {/* crear otros para: - cambiar contraseña ??*/}

            </Stack.Navigator>
        </NavigationContainer>


    )
}
export default MainNav
