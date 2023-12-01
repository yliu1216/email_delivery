import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { WebView as NativeWebView } from 'react-native-webview';
import { StackScreens } from '../../App';
import {useEffect} from 'react';
import axios from 'axios';

type WebviewProps = {
  navigation: NativeStackScreenProps<StackScreens, 'App'>;
  route: RouteProp<StackScreens, 'App'>;
};


export default function WebView({ route }: WebviewProps) {
  const { SESSION_TOKEN } = route.params;
  console.log('EXPO_PUBLIC_WEBAPP_ROOT=%s', process.env.EXPO_PUBLIC_WEBAPP_ROOT);

  const webViewSource = {
    uri: process.env.EXPO_PUBLIC_WEBAPP_ROOT,
    headers: {
      Authorization: `Bearer ${SESSION_TOKEN}`,
    },
  };

  const handle_auth = async () => {
    try {
      const authRes = await axios.get(`http://127.0.0.1:50000/auth`, {
        headers: {
          Cookie: `SESSION_TOKEN=${encodeURIComponent(SESSION_TOKEN)}`,
        },
      });
      console.log(authRes.data); // Assuming your data is logged here
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    handle_auth();
  }, []);

  return (
    <View style={styles.container}>
      <NativeWebView source={webViewSource} />
      <StatusBar style="auto" />
      <Text style={styles.headerText}>Token value: ${SESSION_TOKEN}</Text>
      <Text style={styles.headerText}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText:{
    marginBottom:10,
    fontWeight:'bold',
    fontSize:25,
  },
});

