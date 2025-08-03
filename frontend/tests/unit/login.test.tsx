import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/login';
import { useAuth } from '@/context/auth';
import { router } from 'expo-router';

// Mock the auth context
jest.mock('@/context/auth', () => ({
    useAuth: jest.fn(),
}));

// Mock expo-router
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

describe('LoginScreen', () => {
    // Mock the login function for auth context
    const mockLogin = jest.fn();

    beforeEach(() => {
        // Reset mocks so we start fresh for each test
        jest.clearAllMocks();
        // Resetup useAuth mock
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
        });
    });

    it('should render all form elements', () => {
        const { getByPlaceholderText, getByTestId, getByText } = render(<LoginScreen />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByTestId('login-button')).toBeTruthy();
        expect(getByText("Don't have an account? Register")).toBeTruthy();
    });

    it('should show error when form is submitted empty', () => {
        const { getByTestId } = render(<LoginScreen />);
        const alertSpy = jest.spyOn(window, 'alert');

        // Simulate pressing the login button without filling the form
        fireEvent.press(getByTestId('login-button'));

        expect(alertSpy).toHaveBeenCalledWith('Email and password are required');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should call login and redirect on successful submission', async () => {
        const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
        // Mock successful login
        mockLogin.mockResolvedValueOnce({});

        // Fill the form with valid credentials
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByTestId('login-button'));

        // Wait for the login function to be called and the router to redirect
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(router.replace).toHaveBeenCalledWith('/');
        });
    });

    it('should navigate to register screen when register link is pressed', () => {
        const { getByText } = render(<LoginScreen />);
        fireEvent.press(getByText("Don't have an account? Register"));
        expect(router.push).toHaveBeenCalledWith('/register');
    });
});
