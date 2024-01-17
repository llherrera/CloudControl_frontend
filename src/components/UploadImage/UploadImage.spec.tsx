import { render, screen } from '@testing-library/react';

import { UploadImage } from './UploadImage';

describe('UploadImage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<UploadImage />);
    expect(screen.getByText('Welcome to UploadImage!')).toBeTruthy();
  });
});