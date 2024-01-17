import { render, screen } from '@testing-library/react';

import { NodesList } from './NodesList';

describe('NodesList', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<NodesList />);
    expect(screen.getByText('Welcome to NodesList!')).toBeTruthy();
  });
});