import { render, screen } from '@testing-library/react';

import { PDT } from './PDT';

describe('PDT', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<PDT />);
    expect(screen.getByText('Welcome to PDT!')).toBeTruthy();
  });
});