import { useAuth } from '@/context/auth';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register } = useAuth();

    const handleRegister = async () => {
        await register(email, password);
        // Redirect to the home page after successful registration
        router.replace('/');
    };

    return (
        <>
            {/* Make sure we don't show screen header */}
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Register</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <ThemedView style={styles.button} onTouchEnd={handleRegister}>
                    <ThemedText style={styles.buttonText}>Register</ThemedText>
                </ThemedView>
                <Link href='/login'>
                    <ThemedView style={styles.link}>
                        <ThemedText>Already have an account? Login</ThemedText>
                    </ThemedView>
                </Link>
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
