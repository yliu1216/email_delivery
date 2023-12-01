import {StatusBar} from 'expo-status-bar';
import {StyleSheet, TextInput, TouchableOpacity, View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {StackScreens} from '../../App';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Register({}: NativeStackScreenProps<StackScreens, 'Register'>) {
    //hooks for input 
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[buttonDisable, setButtonDisable] = useState(true);

  const navigation = useNavigation();
  
      //call api for user register 
      const handleRegister = async() => {
        try{
            const responseData = await axios.post(
                `http://127.0.0.1:50000/auth/register`, 
                {username, password}, {withCredentials:true}
            );      
            const{token} = responseData.data.data;
            console.log(token);
            alert('Register successful');
            setUsername('');
            setPassword('');   
            navigation.navigate('Login');
        }catch(err){
            console.log(err);
        }
    }

    //hooks to ensure the username and password aren't empty
    useEffect(()=>{
      if(username.length > 0 && password.length > 0){
        setButtonDisable(false);
      }else{
        setButtonDisable(true);
      }
    });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.headerText}>Register</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Please enter your username' 
        value={username} 
        onChange={e=>setUsername(e.target.value)}
      ></TextInput>
      <TextInput 
        style={styles.input} 
        placeholder='Please enter your password' 
        value={password} 
        onChange={e=>setPassword(e.target.value)} 
        secureTextEntry={true}></TextInput>
      <TouchableOpacity 
        style={styles.RegisterButtonOver}
        onPress={handleRegister}
        disabled={buttonDisable}
      >
        <Text style={styles.RegisterText}>
          Register
        </Text>
      </TouchableOpacity>
      <Text>
        Already have an account?
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
            <Text style={{color:'gray', textDecorationLine: 'underline'}}> Sign in here</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
  },

  headerText:{
    marginBottom:10,
    fontWeight:'bold',
    fontSize:25,
  },

  input:{
    height: 40,
    borderColor: 'gray',
    borderWidth:1,
    marginBottom:12,
    paddingLeft: 8,
    width:200,
    borderRadius:10,
  },


  RegisterButtonOver:{
    backgroundColor:'black',
    padding:10,
    borderRadius:10,
    width:200,
    alignItems:'center',
  },

  RegisterText:{
    color: 'white',
    fontFamily: 'Helvetica',
    fontSize:15,
    fontWeight:'bold',
  }
});
