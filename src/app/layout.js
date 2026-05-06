import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'BroadcastED — Educational Content Broadcasting',
  description: 'Where teachers broadcast, principals approve, and students learn.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#181928',
                color: '#E8E9FF',
                border: '1px solid #252640',
                borderRadius: '12px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '13px',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#C6F135', secondary: '#0B0C17' } },
              error: { iconTheme: { primary: '#FF6B6B', secondary: '#0B0C17' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
