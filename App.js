import { StyleSheet, Text, View } from 'react-native';
import CrearPost from './src/screens/CrearPost';
import Home from './src/screens/Home';
import MainNav from './src/navigation/MainNav';
import Register from './src/screens/Register';
import MyProfile from './src/screens/MyProfile';
function App() {
  return (
    <View style = {styles.contenedorMain}>
      {/* <CrearPost/> */}
      <MainNav/>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorMain:{
    width: '100%'
  }
})
export default App

