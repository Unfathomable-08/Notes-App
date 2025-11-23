import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import postItImage from "@/assets/images/post-it.png";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Notes() {
  const router = useRouter()

  const handleGetStarted = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        router.push("/notes");
      } else {
        router.push("/(auth)/login");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      router.push("/(auth)/login");
    }
  };

  return (
    <View
      style={ styles.container }
    >
      <Image source={postItImage} style={ styles.image } />
      <Text style={ styles.heading }>Welcome to Notes App</Text>
      <Text style={ styles.subheading }>Capture your thoughts anytime, anywhere</Text>
      <TouchableOpacity 
         style={ styles.button }
         onPress={handleGetStarted}
      >
        <Text style={ styles.buttonText } >Get Statrted</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16
  },
  image: {
    width: 200,
    height:200
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})