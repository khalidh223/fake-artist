import { render, fireEvent, waitFor } from '@testing-library/react';
import HomeButtons from '../HomeButtons';

describe('<HomeButtons />', () => {
  it('opens and closes the dialog', async () => {
    const { getByRole, queryByText, getByLabelText } = render(<HomeButtons gameCode={'123ABC'} />);
    const openButton = getByRole('button', { name: 'Start new game' });

    fireEvent.click(openButton);
    expect(queryByText('Enter your username!')).toBeInTheDocument();

    const closeButton = getByRole('button', { name: 'close' });
    fireEvent.click(closeButton);
    await waitFor(() => {
        expect(queryByText('Enter your username!')).not.toBeInTheDocument();
    });
  });
});
