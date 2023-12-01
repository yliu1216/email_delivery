import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {StackScreens} from '../../App';
import axios from 'axios';

export default function Login({}: NativeStackScreenProps<StackScreens, 'Login'>) {
  //hooks for input 
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[buttonDisable, setButtonDisable] = useState(true);

  const navigation = useNavigation();
  
      //call api for user login and handle the token
      const handleLogin = async () => {
        try {
          const responseData = await axios.post(
            `http://127.0.0.1:50000/auth/login`,
            { username, password },
            { withCredentials: true }
          );
          const { token } = responseData.data.data;
          console.log(token);
          alert('login successful');
          setUsername('');
          setPassword('');
          navigation.navigate('App', { SESSION_TOKEN: token }); // Pass the token as a parameter
        } catch (err) {
          console.log(err);
        }
      };
    
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
      <Text style={styles.headerText}>Login</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Please enter your username' 
        value={username}
        onChange={e=>setUsername(e.target.value)}
      >
      </TextInput>
      <TextInput 
        style={styles.input} 
        placeholder='Please enter your password' 
        value={password}
        onChange={e=>setPassword(e.target.value)} 
        secureTextEntry={true}
      >
      </TextInput>
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={buttonDisable}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <Text>
        Don't have an account yet?
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
            <Text style={{color:'gray', textDecorationLine: 'underline'}}> Sign up here</Text>
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

  loginButton:{
    backgroundColor:'black',
    padding:10,
    borderRadius:10,
    width:200,
    alignItems:'center',
  },

  loginText:{
    color: 'white',
    fontFamily: 'Helvetica',
    fontSize:15,
    fontWeight:'bold',
  }
});
