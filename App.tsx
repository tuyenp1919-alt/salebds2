import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ClientManager } from './components/ClientManager';
import { ProjectExplorer } from './components/ProjectExplorer';
import { NextGenAiAssistant } from './components/NextGenAiAssistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AIProvider } from './contexts/AIContext';
import { AuthPage } from './components/auth/AuthPage';
import { INITIAL_CLIENTS } from './constants';
import { Icon } from './components/Icon';


type View = 'dashboard' | 'clients' | 'projects' | 'ai';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="ml-3 font-medium">{label}</span>
  </button>
);

// Main App Content Component (after authentication)
const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard clients={INITIAL_CLIENTS} onNavigate={(view) => setActiveView(view as View)}/>;
      case 'clients':
        return <ClientManager />;
      case 'projects':
        return <ProjectExplorer />;
      case 'ai':
        return <NextGenAiAssistant />;
      default:
        return <Dashboard clients={INITIAL_CLIENTS} onNavigate={(view) => setActiveView(view as View)}/>;
    }
  };
  
  const sidebarContent = (
    <>
      <div className="p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
           <Icon path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" className="w-8 h-8 mr-2 text-blue-600"/>
           Sale AI Pro
        </h1>
      </div>
      <nav className="flex-grow px-4 space-y-2">
        <NavItem 
          label="Bảng điều khiển" 
          isActive={activeView === 'dashboard'} 
          onClick={() => {setActiveView('dashboard'); setIsSidebarOpen(false);}}
          icon={<Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3m-16.5 0h16.5m-16.5 0v2.25A2.25 2.25 0 006 7.5h12A2.25 2.25 0 0020.25 5.25V3" />}
        />
        <NavItem 
          label="Quản lý khách hàng" 
          isActive={activeView === 'clients'} 
          onClick={() => {setActiveView('clients'); setIsSidebarOpen(false);}}
          icon={<Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />}
        />
        <NavItem 
          label="Kho dự án" 
          isActive={activeView === 'projects'} 
          onClick={() => {setActiveView('projects'); setIsSidebarOpen(false);}}
          icon={<Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />}
        />
        <NavItem 
          label="Trợ lý AI" 
          isActive={activeView === 'ai'} 
          onClick={() => {setActiveView('ai'); setIsSidebarOpen(false);}}
          icon={<Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21l-.648-.428a2.25 2.25 0 01-1.423-2.43l.428-2.015-.001-.002z" />}
        />
      </nav>
      <div className="p-4 mt-auto border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img src={user?.avatar || "https://picsum.photos/seed/avatar/40/40"} alt="Avatar" className="w-10 h-10 rounded-full"/>
            <div className="ml-3">
                <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" className="w-4 h-4 mr-2" />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 bg-white shadow-lg w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
        {sidebarContent}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 lg:hidden flex justify-between items-center">
           <h2 className="font-bold text-xl">{
             activeView === 'dashboard' ? 'Bảng điều khiển' :
             activeView === 'clients' ? 'Quản lý khách hàng' :
             activeView === 'projects' ? 'Kho dự án' : 'Trợ lý AI'
           }</h2>
           <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
             <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" />
           </button>
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

// Main App Component with Authentication
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AIProvider>
        <AuthWrapper />
      </AIProvider>
    </AuthProvider>
  );
};

// Wrapper component to handle authentication state
const AuthWrapper: React.FC = () => {
  const { user } = useAuth();
  
  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }
  
  // Show main app if logged in
  return <AppContent />;
};

export default App;
