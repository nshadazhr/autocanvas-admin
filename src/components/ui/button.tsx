import { cn } from '@/src/lib/cn';
import type { ButtonHTMLAttributes } from 'react';
export function Button({
	className,
	variant = 'primary',
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
	return <button className={cn('button', `button-${variant}`, className)} {...props} />;
}
