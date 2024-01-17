import { render, screen } from '@testing-library/react';

import { PDTid } from './PDTid';

describe('PDTid', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<PDTid />);
    expect(screen.getByText('Welcome to PDTid!')).toBeTruthy();
  });
});