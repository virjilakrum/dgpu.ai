import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Toast } from '../components/ui/Toast';
import { ToastData } from '../types/toast';

interface MainLayoutProps {
  children: React.ReactNode;
  connected: boolean;
  connecting: boolean;
  walletAddress?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
  toasts: ToastData[];
  onRemoveToast: (id: number) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  connected,
  connecting,
  walletAddress,
  onConnect,
  onDisconnect,
  currentView,
  onChangeView,
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        connected={connected}
        connecting={connecting}
        walletAddress={walletAddress}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        currentView={currentView as any}
        onChangeView={onChangeView as any}
      />

      <main>{children}</main>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};