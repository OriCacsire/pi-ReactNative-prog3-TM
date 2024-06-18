import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase/config';

export default class MyImagePicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgCargada: ''
        }
    }
    activarPicker() {
        // Metodo que utiliza imagePicker
        ImagePicker.launchCameraAsync() //es una promesa
            .then( image => this.setState({
                imgCargada:image.assets[0].uri //solo entra al then si el usuario selecciono una img, dado que se realizo la accion de imagePicker
            }))
            .catch((err)=>console.log(err)) //error al seleccionar la foto o el usuario no trae nada
    }
    // acepto y guardo mi foto en firebase storage y nos entrega la url de acceso
    aceptarImagen(){
        fetch(this.state.imgCargada) //como es una promesa se ahce un then y un catch
        // recibe la img, la parsea con blod y pasa a otro then
        .then(resp => resp.blob())
        // llega la img como lo necesitamos
        .then(image =>{
            let ref = storage.ref(`imgPerfil/${Date.now()}.jpeg`) //le cargamos la ruta donde queremos que se guarde en el storage
            ref.put(image)
            .then(()=>{
                ref.getDownloadURL()
                .then(url => this.props.actualizarImgUrl(url)) //props envida desde imgUpload.js
            }) 
        })
        .catch((err) => console.log(err))
    }
    
    rechazarImagen(){
        this.setState({imgCargada: ''})
    }
    
    render() {
        return (
            <View>
                {this.state.imgCargada != ''
                    ?
                    <View style ={styles.container}>
                        
                        <Image
                            style={styles.img}
                            source={{ uri: this.state.imgCargada }}
                        />
                        <TouchableOpacity
                            onPress={() => this.aceptarImagen()}
                            style={styles.btn}>
                            <Text style={styles.btnText}> Aceptar imagen </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.rechazarImagen()}
                            style={styles.btn}>
                            <Text style={styles.btnText}> Rechazar imagen </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style ={styles.container}>
                        <TouchableOpacity 
                            onPress={() => this.activarPicker()}
                            style={styles.btn}>
                            <Text style={styles.btnText}>Subi tu foto</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    img: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20
    },
    btn: {
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center'
    },
    btnText: {
        color: '#f0f0f0',
        fontWeight: 'bold'
    }
});