import { render, screen } from '@testing-library/react';

import { Frame } from './Frame';

describe('Frame', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Frame />);
    expect(screen.getByText('Welcome to Frame!')).toBeTruthy();
  });
});