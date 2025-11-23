import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons'
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
  const [notes, setNotes] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        
        const response = await axios.get('http://localhost:8080/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setNotes(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchNotes()
  }, [])

  const addNote = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      
      const response = await axios.post('http://localhost:8080/api/notes', {
        title,
        content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNotes([...notes, response.data.data])
      setTitle('')
      setContent('')
      setIsModalVisible(false)
    }
  }
  
  return (
    <View
      style={ styles.container }
    >
      <Text style={ styles.heading } >Notes</Text>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={ styles.list }
        showsVerticalScrollIndicator={false}
        />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={ styles.modalContainer }>
          <View style={ styles.modalContent } >
            <Text style={ styles.modalTitle }>Add New Note</Text>
            <TextInput
              style={ styles.modalInput }
              placeholder="Title"
              value={ title }
              onChangeText={ setTitle }
              autoFocus
              keyboardType="default"
            />
            <TextInput
              style={ styles.modalInput }
              placeholder="Content"
              multiline
              value={ content }
              onChangeText={ setContent }
              keyboardType="default"
              numberOfLines={4}
            />
            <View style={{ flexDirection: 'row', flex: 1, width: '100%', gap: 10 }}>
              <TouchableOpacity style={ styles.modalButton } onPress={() => setIsModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ styles.modalButton } onPress={ addNote }>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center'
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%'
  },
  note: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
  }
})