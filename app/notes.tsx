import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get("https://notes-app-backend-node-express.vercel.app/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setIsModalVisible(true);
  };

  const openEditModal = (note) => {
    setIsEditing(true);
    setEditingNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(null);
    setViewModalVisible(false);
    setIsModalVisible(true);
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content are required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (isEditing) {
        // Update existing note
        const response = await axios.put(
          `https://notes-app-backend-node-express.vercel.app/api/notes/${editingNoteId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotes(notes.map((n) => (n._id === editingNoteId ? response.data.data : n)));
      } else {
        // Create new note
        const response = await axios.post(
          "https://notes-app-backend-node-express.vercel.app/api/notes",
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes([...notes, response.data.data]);
      }

      // Reset and close
      setIsModalVisible(false);
      setTitle("");
      setContent("");
      setIsEditing(false);
      setEditingNoteId(null);
    } catch (err) {
      console.error("Error saving note:", err);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const deleteNote = async (id) => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        await axios.delete(`https://notes-app-backend-node-express.vercel.app/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notes.filter((n) => n._id !== id));
        setViewModalVisible(false);
        setSelectedNote(null);
      } catch (err) {
        Alert.alert("Error", "Failed to delete note");
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Notes</Text>

      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() => {
              setSelectedNote(item);
              setViewModalVisible(true);
            }}
          >
            <View>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.notePreview} numberOfLines={2}>
                {item.content || "No content"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add / Edit Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Note" : "New Note"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Note Title"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Start typing..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveNote}
              >
                <Text style={styles.buttonText}>
                  {isEditing ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Note Modal */}
      <Modal
        visible={viewModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.viewModalContent}>
            {selectedNote && (
              <>
                <View style={styles.viewHeader}>
                  <Text style={styles.viewTitle}>{selectedNote.title}</Text>
                  <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                    <Ionicons name="close" size={28} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.noteContentContainer}>
                  <Text style={styles.noteContentText}>
                    {selectedNote.content || "No content added."}
                  </Text>
                </View>

                <View style={styles.viewActions}>
                  <TouchableOpacity
                    style={[styles.viewActionButton, styles.editBtn]}
                    onPress={() => openEditModal(selectedNote)}
                  >
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.viewActionButton, styles.deleteBtn]}
                    onPress={() => deleteNote(selectedNote._id)}
                  >
                    <Ionicons name="trash" size={20} color="#FF3B30" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Enhanced Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  list: { paddingHorizontal: 16 },
  noteCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  noteTitle: { fontSize: 17, fontWeight: "600", color: "#333" },
  notePreview: { fontSize: 14, color: "#888", marginTop: 4 },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  multilineInput: { height: 140, paddingTop: 14 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#aaa" },
  saveButton: { backgroundColor: "#007AFF" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // View Modal
  viewModalContent: {
    backgroundColor: "#fff",
    width: "92%",
    maxHeight: "85%",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  viewTitle: { fontSize: 22, fontWeight: "bold", flex: 1, marginRight: 10 },
  noteContentContainer: {
    padding: 20,
    minHeight: 200,
  },
  noteContentText: { fontSize: 16, lineHeight: 24, color: "#444" },
  viewActions: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 10,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  viewActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editBtn: { backgroundColor: "#E3F2FD", borderWidth: 1, borderColor: "#BBDEFB" },
  deleteBtn: { backgroundColor: "#FFEBEE", borderWidth: 1, borderColor: "#FFCDD2" },
  editBtnText: { color: "#007AFF", fontWeight: "600" },
  deleteBtnText: { color: "#FF3B30", fontWeight: "600" },
});