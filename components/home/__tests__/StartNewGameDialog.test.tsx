import { render } from '@testing-library/react';
import StartNewGameDialog from '../StartNewGameDialog';

describe('<StartNewGameDialog />', () => {
  it('renders title, game code, and username input', () => {
    const { getByText, getByPlaceholderText } = render(<StartNewGameDialog open={true} onClose={() => {}} />);
    
    expect(getByText('Enter your username!')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByText('345678')).toBeInTheDocument();
  });
});