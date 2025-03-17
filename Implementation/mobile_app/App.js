import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { getItem, storeItem, removeItem } from './persiststorage/AsyncStorage';
import Home from './screens/Home';
import InfoClient from './screens/InfoClient';
import History from './screens/History';
import PushNotification from './screens/PushNotification';
import Settings from './screens/Settings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
    async function getToken() {
      try {
        const jwt = await Promise.race([
          getItem("jwt"),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        if (jwt) {
          setToken(jwt);
        }
      } catch (error) {
      }
    };
    getToken();
  }, []);

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  const Login = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('Admin');

    let url = "192.168.2.24:8080/"; // Yookr
    url = "192.168.8.101:8080"; // Dendron (Dendron_W&T_2.4G)
    // url = "192.168.1.20:8080"; // Venray

    const handleLogin = () => {
      axios.post(`http://${url}api/auth/authenticate`, {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          storeItem('jwt', response.data.token);
          setToken(response.data.token);
        })
        .catch(function (error) {
          console.log(error);
          storeItem('jwt', "Offline-token");
          setToken("Offline-token");
        });
    };

    return (
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  const Logout = () => {
    removeItem('jwt');
    setToken("");
    return (<></>);
  }

  return (
    <NavigationContainer>
      {token === "" ?
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Login',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          />
        </Stack.Navigator>
        :
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              drawerIcon: () => <Icon name="home" size={24} color="black" style={styles.Icon} />,
            }} />
          <Drawer.Screen
            name="InfoClient"
            component={InfoClient}
            options={{
              drawerIcon: () => <Icon name="user" size={24} color="black" style={styles.Icon} />,
            }} />
          <Drawer.Screen
            name="History"
            component={History}
            options={{
              drawerIcon: () => <Icon name="history" size={24} color="black" style={styles.Icon} />,
            }} />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              drawerIcon: () => <Icon name="cog" size={24} color="black" style={styles.Icon} />,
            }} />
          <Drawer.Screen
            name="Notifications"
            component={PushNotification}
            options={{
              drawerIcon: () => <Icon name="bell" size={24} color="black" style={styles.Icon} />,
            }} />
          <Drawer.Screen
            name="Logout"
            component={Logout}
            options={{
              drawerIcon: () => <Icon name="sign-out" size={24} color="black" style={styles.Icon} />,
            }} />
        </Drawer.Navigator>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  Icon: {
    width: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF'
  },
  input: {
    width: 200,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});
