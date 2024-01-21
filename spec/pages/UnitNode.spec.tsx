import { render, screen } from '@testing-library/react';

import { UnitNodePage } from '../../src/pages/UnitNode/UnitNodePage';
import { SettingsPage } from '../../src/pages/UnitNode/SettingsPage';

describe('UnitNodePage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<UnitNodePage />);
    expect(screen.getByText('Welcome to UnitNodePage!')).toBeTruthy();
  });
});

describe('SettingsPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<SettingsPage />);
    expect(screen.getByText('Welcome to SettingsPage!')).toBeTruthy();
  });
});