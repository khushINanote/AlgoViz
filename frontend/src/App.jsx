import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import AlgorithmView from './pages/AlgorithmView';
import CompareMode from './pages/CompareMode';
import InterviewMode from './pages/InterviewMode';
import DataStructureView from './pages/DataStructureView';
import GraphView from './pages/GraphView';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Categories />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="algorithms" element={<Categories />} />
                        <Route path="algorithms/:id" element={<AlgorithmView />} />
                        <Route path="data-structures/:id" element={<DataStructureView />} />
                        <Route path="graphs/:id" element={<GraphView />} />
                        <Route path="compare" element={<CompareMode />} />
                        <Route path="interview" element={<InterviewMode />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
