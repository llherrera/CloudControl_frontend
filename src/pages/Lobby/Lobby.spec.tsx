import { render, screen } from '@testing-library/react';

import { LobbyPage } from './LobbyPage';

describe('LobbyPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<LobbyPage />);
    expect(screen.getByText('Welcome to LobbyPage!')).toBeTruthy();
  });
});