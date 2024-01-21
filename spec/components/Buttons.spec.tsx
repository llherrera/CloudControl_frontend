import { render, screen } from '@testing-library/react';

import { 
    BackBtn,
    ButtonComponent,
    ButtonPlan } from '../../src/components/Buttons/index';

describe('BackBtn', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<BackBtn />);
        expect(screen.getByText('Welcome to BackBtn!')).toBeTruthy();
    });
});

describe('ButtonComponent', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<ButtonComponent />);
        expect(screen.getByText('Welcome to ButtonComponent!')).toBeTruthy();
    });
});

describe('ButtonPlan', () => {
    it('should render successfully', () => {
        expect.hasAssertions();
        //render(<ButtonPlan />);
        expect(screen.getByText('Welcome to ButtonPlan!')).toBeTruthy();
    });
});