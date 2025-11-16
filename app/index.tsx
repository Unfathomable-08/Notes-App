import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import postItImage from "@/assets/images/post-it.png";

export default function Index() {
  return (
    <View
      style={ styles.container }
    >
      <Image source={postItImage} style={ styles.image } />
      <Text style={ styles.heading }>Welcome to Notes App</Text>
      <Text style={ styles.subheading }>Capture your thoughts anytime, anywhere</Text>
      <TouchableOpacity 
      >
        <Text>Get Statrted</Text>
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
  }
})