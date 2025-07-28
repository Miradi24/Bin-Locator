import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface MarkerModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
    defaultValue?: string;
}

export default function AddMarkerModal({ visible, onClose, onSubmit, defaultValue = '' }: MarkerModalProps) {
    const [title, setTitle] = useState(defaultValue);

    const handleSubmit = () => {
        // Check if title is empty
        if (title.length === 0) {
            alert('Title cannot be empty');
            return;
        }
        // Trim whitespace and check if title is not just spaces
        if (title.trim()) {
            onSubmit(title);
            setTitle('');
        }
    };

    return (
        <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Enter Bin Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter marker title'
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                        placeholderTextColor='#999'
                    />
                    <View style={styles.buttonContainer}>
                        <Button title='Save' onPress={handleSubmit} />
                        <Button title='Cancel' onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    input: {
        height: 40,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
