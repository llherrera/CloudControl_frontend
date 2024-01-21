import React from 'react';
import { render, screen } from '@testing-library/react';

import { UpdateEvidence } from '../../src/pages/Evidence/UpdateEvidence';
import { ListEvidence } from '../../src/pages/Evidence/ListEvidence';
import { EvidencePage } from '../../src/pages/Evidence/EvidencePage';

describe('EvidencePage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<EvidencePage />);
    expect(screen.getByText('Welcome to EvidencePage!')).toBeTruthy();
  });
});

describe('ListEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ListEvidence />);
    expect(screen.getByText('Welcome to ListEvidence!')).toBeTruthy();
  });
});

describe('UpdateEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<UpdateEvidence />);
    expect(screen.getByText('Welcome to UpdateEvidence!')).toBeTruthy();
  });
});