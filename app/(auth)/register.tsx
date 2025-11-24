import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleLogin = async () => {
    try {
      setLoading(true)
      const response = await axios.post('https://notes-app-backend-node-express.vercel.app/api/user/register', {
        username: name,
        email,
        password
      })
      
      if (response.data.success){
        const token = response.data.token

        await AsyncStorage.setItem('userToken', token);
        
        console.log(response.data)
        router.push('/(auth)/login')
      }
      else {
        setError(response.data.message || 'Registration failed')
        console.log(response.data)
      }
    }
    catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || 'Registration failed')
      console.log(error)
      alert('Registration failed. Please try again.')
    } 
    finally {
      setLoading(false)
    }
  }

  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>Register</Text>

      <TextInput
        style={ styles.input }
        placeholder='Name'
        value={ name }
        onChangeText={ setName }
        keyboardType='default'
        autoCapitalize='none'
      />
      <TextInput
        style={ styles.input }
        placeholder='Email'
        value={ email }
        onChangeText={ setEmail }
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        style={ styles.input }
        placeholder='Password'
        value={ password }
        onChangeText={ setPassword }
        secureTextEntry
      />
      <TouchableOpacity style={ styles.button } onPress={ handleLogin }>
        <Text style={ styles.buttonText }>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => router.push('/(auth)/login') }>
        <Text style={ styles.link }>Have an account? Login Instead</Text>
      </TouchableOpacity>
      <View style={ styles.socialLoginContainer }>
        <TouchableOpacity style={ styles.socialButton }>
          <Image source={ require('@/assets/images/google.webp') } style={ styles.socialIcon } />
          <Text style={ styles.socialButtonText }>Continue with Google</Text>
           </TouchableOpacity>
           <TouchableOpacity style={ styles.socialButton }>
              <Image source={ require('@/assets/images/facebook.png') } style={ styles.socialIcon } />
              <Text style={ styles.socialButtonText }>Continue with Facebook</Text>
            </TouchableOpacity>
       </View>

      { error && <Text style={{ color: 'red', textAlign: 'center' }}>{ error }</Text> }
      { loading && <Text style={{ textAlign: 'center' }}>Loading...</Text> }
      
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10
  },
  socialLoginContainer: {
    marginTop: 20
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  socialButtonText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})