import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Mentistech check-in page', () => {
  render(<App />);

  const greetingElement = screen.getByText(/Olá, João!/i);

  expect(greetingElement).toBeInTheDocument();
});
