import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ContactScreen from '@/app/(tabs)/contact';
import emailjs from '@emailjs/browser';

// Mock emailjs
jest.mock('@emailjs/browser', () => ({
    send: jest.fn(),
}));

// Mock bottom tab navigation
jest.mock('@react-navigation/bottom-tabs', () => ({
    ...jest.requireActual('@react-navigation/bottom-tabs'),
    useBottomTabBarHeight: () => 49,
}));

// Mock ParallaxScrollView component
jest.mock('@/components/ParallaxScrollView', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ContactScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all form elements', () => {
        const { getByPlaceholderText, getByTestId } = render(<ContactScreen />);

        // Check if all form elements are rendered
        expect(getByPlaceholderText('Enter your name')).toBeTruthy();
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
        expect(getByPlaceholderText('Enter your message')).toBeTruthy();
        expect(getByTestId('submit-button')).toBeTruthy();
    });

    it('should show error when form is submitted empty', () => {
        const { getByTestId, findByText } = render(<ContactScreen />);
        fireEvent.press(getByTestId('submit-button'));

        // Check if error messages are displayed
        expect(findByText('Name is required')).toBeTruthy();
        expect(findByText('Email is required')).toBeTruthy();
        expect(findByText('Message is required')).toBeTruthy();
        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('should send email on successful form submission', async () => {
        (emailjs.send as jest.Mock).mockResolvedValueOnce({ status: 200 });
        jest.spyOn(Alert, 'alert');
        const { getByPlaceholderText, getByTestId } = render(<ContactScreen />);

        // Fill in the form and submit
        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Enter your message'), 'Test message');
        fireEvent.press(getByTestId('submit-button'));

        // Check if emailjs.send was called twice
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalledTimes(2);
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Your message has been sent successfully!');
        });
    });

    it('should show error message on email send failure', async () => {
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        const error = new Error('Failed to send');
        (emailjs.send as jest.Mock).mockRejectedValueOnce(error);

        const { getByPlaceholderText, getByTestId } = render(<ContactScreen />);

        // Fill in the form and submit
        fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Enter your message'), 'Test message');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to send message. Please try again later.');
        });
    });
});
