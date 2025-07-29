import { useAuth } from '@/context/auth';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        // Input validation
        if (!email || !password) {
            alert('Email and password are required');
            return;
        }
        try {
            await login(email, password);
            // Redirect to the home page after successful login
            router.replace('/');
        } catch (error) {
            // @ts-ignore
            alert('Login failed: ' + error.response?.data?.msg || error.message);
            return;
        }
    };

    return (
        <>
            {/* Make sure we don't show screen header */}
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Login</ThemedText>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <ThemedText style={styles.buttonText}>Login</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <ThemedView style={styles.link}>
                        <ThemedText>Don't have an account? Register</ThemedText>
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
