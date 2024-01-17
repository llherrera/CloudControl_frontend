import { render, screen } from '@testing-library/react';

import { RegisterPage } from './RegisterPage';

describe('RegisterPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<RegisterPage />);
    expect(screen.getByText('Welcome to RegisterPage!')).toBeTruthy();
  });
});