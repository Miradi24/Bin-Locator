import { useAuth } from '@/context/auth';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register } = useAuth();

    const handleRegister = async () => {
        // Input validation
        if (!email || !password || !confirmPassword) {
            alert('Email and password are required');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register(email, password);
            // Redirect to the home page after successful registration
            router.replace('/');
        } catch (error) {
            // @ts-ignore
            alert('Registration failed: ' + error.response?.data?.msg || error.message);
        }
    };

    return (
        <>
            {/* Make sure we don't show screen header */}
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Register</ThemedText>
                <TextInput
                    placeholderTextColor='#999'
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                <TextInput
                    placeholderTextColor='#999'
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    placeholderTextColor='#999'
                    style={styles.input}
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <ThemedText style={styles.buttonText}>Register</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <ThemedView style={styles.link}>
                        <ThemedText>Already have an account? Login</ThemedText>
                    </ThemedView>
                </TouchableOpacity>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        alignItems: 'center',
        padding: 10,
    },
});
