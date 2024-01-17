import { render, screen } from '@testing-library/react';

import { Content } from './Content';

describe('Content', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Content />);
    expect(screen.getByText('Welcome to Content!')).toBeTruthy();
  });
});