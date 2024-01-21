import { render, screen } from '@testing-library/react';

import { PDT } from '../../src/pages/PDT/PDT';
import { PDTid } from '../../src/pages/PDT/PDTid';

describe('PDT', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<PDT />);
    expect(screen.getByText('Welcome to PDT!')).toBeTruthy();
  });
});

describe('PDTid', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<PDTid />);
    expect(screen.getByText('Welcome to PDTid!')).toBeTruthy();
  });
});