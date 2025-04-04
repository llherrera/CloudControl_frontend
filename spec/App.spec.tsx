import { render, screen } from '@testing-library/react';
import App from '@/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText('Selecciona un usuario en la derecha para comenzar');
  expect(linkElement).toBeInTheDocument();
});
