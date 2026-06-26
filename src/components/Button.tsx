import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'ghost'
  | 'again'
  | 'hard'
  | 'good'
  | 'easy';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  small?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'default',
  small = false,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const variantClass = variant === 'default' ? '' : variant;
  const classes = ['btn', variantClass, small ? 'small' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
