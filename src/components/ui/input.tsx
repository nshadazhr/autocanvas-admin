import type { InputHTMLAttributes } from 'react';
import { cn } from '@/src/lib/cn';
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={cn('input', className)} {...props} />;
}
