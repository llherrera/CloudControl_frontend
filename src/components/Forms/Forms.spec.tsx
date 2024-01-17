import { render, screen } from '@testing-library/react';

import { 
    ColorForm,
    EvidenceForm,
    LevelForm,
    LocationsForm,
    LoginForm,
    NodeForm,
    PDTForm,
    RegisterForm,
    SecretaryForm } from './index';

describe('ColorForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<ColorForm />);
        expect(screen.getByText('Welcome to ColorForm!')).toBeTruthy();
    });
});

describe('EvidenceForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        render(<EvidenceForm />);
        expect(screen.getByText('Welcome to EvidenceForm!')).toBeTruthy();
    });
});

describe('LevelForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<LevelForm />);
        expect(screen.getByText('Welcome to LevelForm!')).toBeTruthy();
    });
});

describe('LocationsForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        render(<LocationsForm />);
        expect(screen.getByText('Welcome to LocationsForm!')).toBeTruthy();
    });
});

describe('LoginForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        render(<LoginForm />);
        expect(screen.getByText('Welcome to LoginForm!')).toBeTruthy();
    });
});

describe('NodeForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<NodeForm />);
        expect(screen.getByText('Welcome to NodeForm!')).toBeTruthy();
    });
});

describe('PDTForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        render(<PDTForm />);
        expect(screen.getByText('Welcome to PDTForm!')).toBeTruthy();
    });
});

describe('RegisterForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<RegisterForm />);
        expect(screen.getByText('Welcome to RegisterForm!')).toBeTruthy();
    });
});

describe('SecretaryForm', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        render(<SecretaryForm />);
        expect(screen.getByText('Welcome to SecretaryForm!')).toBeTruthy();
    });
});