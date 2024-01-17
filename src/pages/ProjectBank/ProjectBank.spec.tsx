import { render, screen } from '@testing-library/react';

import { ProjectBank } from './ProjectBank';

describe('ProjectBank', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ProjectBank />);
    expect(screen.getByText('Welcome to ProjectBank!')).toBeTruthy();
  });
});