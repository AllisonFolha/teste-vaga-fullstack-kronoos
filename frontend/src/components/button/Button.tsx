import React from 'react';
import './Button.scss';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  label: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, type = 'button' }) => {
  return (
    <button type={type} className={`button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
