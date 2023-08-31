import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import GameCodeInput from '../GameCodeInput'

describe('<GameCodeInput />', () => {
    it('renders without crashing', () => {
        render(<GameCodeInput />);
    });

    it('renders 6 input fields', () => {
        const { container } = render(<GameCodeInput />);
        const inputs = container.querySelectorAll('input');
        expect(inputs.length).toBe(6);
    });

    it('focuses next input on value entry', () => {
        const { getAllByRole } = render(<GameCodeInput />);
        const inputs = getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(document.activeElement).toBe(inputs[1]);
    });

    it('focuses previous input on backspace in empty field', () => {
        const { getAllByRole } = render(<GameCodeInput />);
        const inputs = getAllByRole('textbox');
        fireEvent.keyDown(inputs[1], { key: 'Backspace' });
        expect(document.activeElement).toBe(inputs[0]);
    });
});