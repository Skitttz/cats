import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Login from './Components/Login/Login';
import User from './Components/User/User';
import { BrowserRouter, Route, Routes } from 'react-router';
import { UserStorage } from './UserContext';
import ProtectedRouter from './Components/Helper/ProtectedRouter';
import Photo from './Components/Photo/Photo';
import UserProfile from './Components/User/UserProfile';
import NotFound404 from './Components/Helper/404/NotFound404';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatNotificationsStorage } from './ChatNotificationsContext';
import { PwaUpdatePrompt } from './Components/PwaUpdatePrompt';
import ProfileOnboarding from './Components/User/ProfileOnboarding';
import OnboardingGuard from './Components/Helper/OnboardingGuard';

function App() {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserStorage>
            <ChatNotificationsStorage>
              <Header />
              <main className="AppBody">
                <OnboardingGuard>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login/*" element={<Login />} />
                    <Route
                      path="conta/completar-perfil"
                      element={
                        <ProtectedRouter allowOnboarding>
                          <ProfileOnboarding />
                        </ProtectedRouter>
                      }
                    />
                    <Route
                      path="conta/*"
                      element={
                        <ProtectedRouter>
                          <User />
                        </ProtectedRouter>
                      }
                    />
                    <Route path="photo/:id" element={<Photo />} />
                    <Route path="perfil/:publicId" element={<UserProfile />} />
                    <Route path="*" element={<NotFound404 />} />
                  </Routes>
                </OnboardingGuard>
              </main>
              <PwaUpdatePrompt />
              <Footer />
            </ChatNotificationsStorage>
          </UserStorage>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
