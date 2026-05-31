import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Mentistech login page', () => {
  localStorage.clear();
  render(<App />);
  const emailLabel = screen.getByText(/e-mail/i);
  expect(emailLabel).toBeInTheDocument();
  
});