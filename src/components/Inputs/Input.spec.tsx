import { render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Input />);
    expect(screen.getByText('Welcome to Input!')).toBeTruthy();
  });
});