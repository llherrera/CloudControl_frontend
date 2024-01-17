import { render, screen } from '@testing-library/react';

import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<SettingsPage />);
    expect(screen.getByText('Welcome to SettingsPage!')).toBeTruthy();
  });
});