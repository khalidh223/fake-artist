import { render } from '@testing-library/react';
import Home from '../page';

describe('<Home />', () => {
  it('renders splash image and HomeButtons', () => {
    const { getByAltText, getByRole } = render(<Home />);
    expect(getByAltText('splash image')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Start new game' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Join game' })).toBeInTheDocument();
  });
});