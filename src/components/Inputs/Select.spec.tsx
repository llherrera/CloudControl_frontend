import { render, screen } from '@testing-library/react';

import { Select } from './Select';

describe('Select', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Select />);
    expect(screen.getByText('Welcome to Select!')).toBeTruthy();
  });
});