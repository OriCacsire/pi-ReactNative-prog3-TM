import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import MyImagePicker from '../components/MyImagePicker'
import { db } from '../firebase/config'

export default class CargarFotoPerfil extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fotoPerfil: ''
        }
    }

    actualizarImgUrl(url) {
        this.setState({
            fotoPerfil: url,
            //   userRegistrado: true,
        }, () => { this.saveImg(this.state.fotoPerfil) })
    }

    // Actulizo el doc del usuario
    saveImg(url) {
        console.log('usa el saveImg')
        const userId = this.props.route.params.userId;
        db.collection('users')
            .doc(userId)
            .update({
                fotoPerfil: url
            })
            .then((resp) => {
                this.setState({
                    fotoPerfil: '',
                }, () => this.props.navigation.navigate('login'))
            })
            .catch((err) => console.log(err))
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Cargar foto de perfil</Text>

                <MyImagePicker
                    actualizarImgUrl={(url) => this.actualizarImgUrl(url)}
                />
                <Text style={styles.textLink}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('login')}
                    >
                        <Text style={styles.link}> Continuar sin foto de perfil </Text>
                    </TouchableOpacity>
                </Text>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#1a1a1a',
        textAlign: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#f0f0f0',
        alignSelf: 'center',
    },
    textLink: {
        marginBottom: 24,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f0f0f0',
        textAlign: 'center',
    },
    link: {
        color: '#4d90fe',
    },
})
