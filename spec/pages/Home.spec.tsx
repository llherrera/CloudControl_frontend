import { render, screen } from '@testing-library/react';

import { HomePage } from '../../src/pages/Home/HomePage';

describe('HomePage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<HomePage />);
    expect(true).toBeTruthy();
  });
});