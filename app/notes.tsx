import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons'

export default function Index() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'First Note' },
    { id: 2, title: 'Second Note' },
    { id: 3, title: 'Third Note' },
    { id: 4, title: 'Fourth Note' }
  ])
  
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
  }
})