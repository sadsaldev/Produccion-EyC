import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavProvider } from './context/NavContext';
import { Navbar } from './components/DOM/Navbar';
import { Index } from './components/DOM/Index';
import { QueriesMain } from './components/queries/QueriesMain';
import { QueriesEfective } from './components/queries/QueriesEfective';
import { Networks } from './components/queries/Networks';
import { Dashboard } from './components/dashboard/Dashboard';
import { Login } from './components/user/Login';
import { Signup } from './components/user/Signup';
import { Profile } from './components/user/Profile';
import { ProfileEdit } from './components/user/ProfileEdit';
import { AdminUserControl} from './components/user/AdminUserControl';
import { ProtectedRoute } from './components/DOM/ProtectedRoute';

const App = () => {
    return (
      <div className="container-all">
        <AuthProvider>
          <Router>
            <NavProvider>
              <Navbar/>   
                <Routes>
                    <Route path="/" element={<Index/>} />
                    <Route path="/queries" element={<QueriesMain/>} />
                    <Route path="/queries/efective" element={<QueriesEfective/>}/>
                    <Route path="/queries/networks" element={<Networks/>}/>
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/login" element={
                        <ProtectedRoute>
                            <Login />
                        </ProtectedRoute>
                    } />
                    <Route path="/signup" element={
                        <ProtectedRoute>
                            <Signup />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/profile/edit" element={<ProfileEdit />}/>
                    <Route path="/profile/admin" element={<AdminUserControl />}/>
                </Routes>               
            </NavProvider>  
          </Router>
        </AuthProvider>
      </div>
    );
  };
  
  export default App;