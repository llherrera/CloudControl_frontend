import { render, screen } from '@testing-library/react';

import { InterventionMap } from './InterventionMap';

describe('InterventionMap', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<InterventionMap />);
    expect(screen.getByText('Welcome to InterventionMap!')).toBeTruthy();
  });
});