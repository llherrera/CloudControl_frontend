import { render, screen } from '@testing-library/react';

import { Content } from './Content';
import { TimeLine } from './TimeLine';
import { NodesList } from './NodesList';
import { Graph } from './Graph';

describe('Content', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Content />);
    expect(screen.getByText('Welcome to Content!')).toBeTruthy();
  });
});


describe('NodesList', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<NodesList />);
    expect(screen.getByText('Welcome to NodesList!')).toBeTruthy();
  });
});


describe('TimeLine', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<TimeLine />);
    expect(screen.getByText('Welcome to TimeLine!')).toBeTruthy();
  });
});


describe('Graph', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Graph />);
    expect(screen.getByText('Welcome to Graph!')).toBeTruthy();
  });
});
