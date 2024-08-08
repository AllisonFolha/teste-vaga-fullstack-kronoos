import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileUpload from '../components/fileupload/FileUpload';

test('renders FileUpload component', () => {
  render(<FileUpload onFileUpload={() => {}} />);
  const uploadButton = screen.getByText(/Upload File/i);
  expect(uploadButton).toBeInTheDocument();
});

test('uploads a file', () => {
  const onFileUpload = jest.fn();
  render(<FileUpload onFileUpload={onFileUpload} />);
  const input = screen.getByLabelText(/Choose file/i);
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });
  fireEvent.change(input, { target: { files: [file] } });
  expect(onFileUpload).toHaveBeenCalled();
});
