import emailJs from '@emailjs/browser';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        // Simple regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            message: '',
        };
        let isValid = true;

        // Check if name is empty
        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Check if email is valid and not empty
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Check if message is empty
        if (!message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                // Customer email
                await emailJs.send(
                    'service_nq7gexd',
                    'template_ty7gu2m',
                    {
                        name,
                        email,
                        message,
                    },
                    { publicKey: 'Kl09tqWMe1qs95WrE' }
                );

                // Admin email
                await emailJs.send(
                    'service_nq7gexd',
                    'template_h0fmc3c',
                    {
                        customer: name,
                        customer_email: email,
                        message,
                    },
                    { publicKey: 'Kl09tqWMe1qs95WrE' }
                );

                // Only reset form and show success if both emails sent successfully
                setName('');
                setEmail('');
                setMessage('');
                setErrors({
                    name: '',
                    email: '',
                    message: '',
                });
                Alert.alert('Success', 'Your message has been sent successfully!');
            } catch (error) {
                console.log('Email error:', error);
                Alert.alert('Error', 'Failed to send message. Please try again later.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<IconSymbol size={310} color='#808080' name='envelope' style={styles.headerImage} />}>
            <ThemedView style={styles.container}>
                <ThemedText type='title'>Contact Us</ThemedText>

                <ThemedView style={styles.formGroup}>
                    <ThemedText>Name *</ThemedText>
                    <TextInput
                        style={[styles.input, errors.name ? styles.inputError : null]}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        placeholder='Enter your name'
                        placeholderTextColor='#999'
                    />
                    {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText>Email *</ThemedText>
                    <TextInput
                        style={[styles.input, errors.email ? styles.inputError : null]}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder='Enter your email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        placeholderTextColor='#999'
                    />
                    {errors.email ? <ThemedText style={styles.errorText}>{errors.email}</ThemedText> : null}
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText>Message *</ThemedText>
                    <TextInput
                        style={[styles.input, styles.messageInput, errors.message ? styles.inputError : null]}
                        value={message}
                        onChangeText={(text) => {
                            setMessage(text);
                            setErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder='Enter your message'
                        multiline
                        numberOfLines={4}
                        placeholderTextColor='#999'
                    />
                    {errors.message ? <ThemedText style={styles.errorText}>{errors.message}</ThemedText> : null}
                </ThemedView>

                <TouchableOpacity
                    testID='submit-button'
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={!isSubmitting ? handleSubmit : undefined}>
                    <ThemedText style={styles.submitButtonText}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    container: {
        padding: 20,
        gap: 20,
    },
    formGroup: {
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: '#ff0000',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
    },
});
