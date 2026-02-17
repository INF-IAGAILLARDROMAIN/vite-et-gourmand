import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}
