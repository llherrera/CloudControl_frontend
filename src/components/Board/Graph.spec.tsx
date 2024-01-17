import { render, screen } from '@testing-library/react';

import { Graph } from './Graph';

describe('Graph', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Graph />);
    expect(screen.getByText('Welcome to Graph!')).toBeTruthy();
  });
});