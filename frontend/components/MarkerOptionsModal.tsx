import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MarkerOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    onNavigate: () => void;
}

export default function MarkerOptionsModal({ visible, onClose, title, onNavigate }: MarkerOptionsModalProps) {
    return (
        <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity
                        style={styles.navigationButton}
                        onPress={() => {
                            onNavigate();
                            onClose();
                        }}>
                        <Ionicons name='navigate' size={24} color='blue' />
                        <Text style={styles.navigationText}>Navigate</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    navigationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    navigationText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'blue',
    },
});
