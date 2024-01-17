import { render, screen } from '@testing-library/react';

import { SettingPage } from './SettingPage';

describe('SettingPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<SettingPage />);
    expect(screen.getByText('Welcome to SettingPage!')).toBeTruthy();
  });
});