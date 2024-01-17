import { render, screen } from '@testing-library/react';

import { TimeLine } from './TimeLine';

describe('TimeLine', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<TimeLine />);
    expect(screen.getByText('Welcome to TimeLine!')).toBeTruthy();
  });
});