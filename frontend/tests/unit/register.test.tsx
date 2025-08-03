import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/app/register';
import { useAuth } from '@/context/auth';
import { router } from 'expo-router';

// Mock the auth hook
jest.mock('@/context/auth', () => ({
    useAuth: jest.fn(),
}));

// Mock the expo router
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
        push: jest.fn(),
    },
    Stack: {
        Screen: () => null,
    },
}));

// Define a global alert mock to handle alert calls in tests
(global as any).alert = jest.fn();

describe('RegisterScreen', () => {
    // Mock the register function for auth context
    const mockRegister = jest.fn();

    beforeEach(() => {
        // Reset mocks so we start fresh for each test
        jest.clearAllMocks();
        // Resetup useAuth mock
        (useAuth as jest.Mock).mockReturnValue({
            register: mockRegister,
        });
    });

    it('should render all form elements', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Register')).toBeTruthy();
        expect(getByText('Already have an account? Login')).toBeTruthy();
    });

    it('should show error when form is submitted empty', () => {
        const { getByText } = render(<RegisterScreen />);
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();

        // Simulate pressing the register button without filling the form
        fireEvent.press(getByText('Register'));

        expect(alertMock).toHaveBeenCalledWith('Email and password are required');
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should show error when passwords do not match', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();

        // Fill the form with mismatched passwords
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password456');
        fireEvent.press(getByText('Register'));

        expect(alertMock).toHaveBeenCalledWith('Passwords do not match');
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should call register and redirect on successful submission', async () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
        // Mock successful registration
        mockRegister.mockResolvedValueOnce({});

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
        // Simulate pressing the register button
        fireEvent.press(getByText('Register'));

        // Wait for the register function to be called and the router to redirect
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(router.replace).toHaveBeenCalledWith('/');
        });
    });

    it('should navigate to login screen when login link is pressed', () => {
        const { getByText } = render(<RegisterScreen />);

        // Simulate pressing the login link
        fireEvent.press(getByText('Already have an account? Login'));

        expect(router.push).toHaveBeenCalledWith('/login');
    });
});
