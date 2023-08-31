import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import JoinGameDialog from '../JoinGameDialog'

describe('<JoinGameDialog />', () => {
    let mockOnClose: jest.Mock

    beforeEach(() => {
        mockOnClose = jest.fn()
    })

    it('renders without crashing', () => {
        render(<JoinGameDialog open={true} onClose={mockOnClose} />)
    })

    it('opens and closes based on prop', () => {
        const { getByRole, rerender } = render(<JoinGameDialog open={true} onClose={mockOnClose} />)
        expect(getByRole('dialog')).toBeVisible()

        rerender(<JoinGameDialog open={false} onClose={mockOnClose} />)
        expect(getByRole('dialog')).not.toBeVisible()
    })

    it('closes dialog on close button click', () => {
        const { getByLabelText } = render(<JoinGameDialog open={true} onClose={mockOnClose} />)
        fireEvent.click(getByLabelText('close'))
        expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('closes dialog on join button click', () => {
        const { getByText } = render(<JoinGameDialog open={true} onClose={mockOnClose} />)
        fireEvent.click(getByText('Join'))
        expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('displays username and game code input fields', () => {
        const { getByPlaceholderText } = render(<JoinGameDialog open={true} onClose={mockOnClose} />)
        expect(getByPlaceholderText('Username')).toBeInTheDocument()
        // Since GameCodeInput has multiple similar inputs, we only check for its presence
        expect(document.querySelector('input')).toBeInTheDocument()
    })
})