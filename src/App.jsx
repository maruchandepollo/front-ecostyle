import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProductsProvider } from "./context/ProductsProvider";
import { LayoutProvider } from "./context/LayoutProvider";
import { useAuth } from "./hooks/useAuth";
import Perfil from "./components/Perfil";
import Admin from "./components/Admin";



// Componentes
import Footer from "./components/Footer";
import Index from "./components/Index";
import Login from "./components/Login";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Sidebar from "./components/Sidebar";
import SobreNosotros from "./components/SobreNosotros";


function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser?.role === "admin" ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/sobre-nosotros"
            element={
              <SobreNosotros />
              } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <LayoutProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LayoutProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
