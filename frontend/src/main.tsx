import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TransactionPage from './views/TransactionPage.tsx'
import CreateTransactionPage from './views/CreateTransactionPage.tsx'
import AddProductPage from './views/AddProductPage.tsx'
import ProductPage from './views/ProductPage.tsx'
import CustomerPage from './views/CustomerPage.tsx'
import ViewTransactionPage from './views/ViewTransactionPage.tsx'
import ViewProductPage from './views/ViewProductPage.tsx'
import ViewCustomerPage from './views/ViewCustomerPage.tsx'
import LoginPage from './views/LoginPage.tsx'
import axios from 'axios'
import CreateAdmin from './views/CreateAdmin.tsx'
import AdminPage from './views/AdminPage.tsx'
import ViewAdminPage from './views/ViewAdminPage.tsx'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route
            path='/'
            element={
              <LoginPage />
            }
          />
          <Route
            path='/tambah-produk'
            element={
              <AddProductPage />
            }
          />
          <Route
            path='/produk/:productId'
            element={
              <ViewProductPage />
            }
          />
          <Route
            path='/daftar-produk'
            element={
              <ProductPage />
            }
          />
          <Route
            path='/buat-transaksi'
            element={
              <CreateTransactionPage />
            }
          />
          <Route
            path='/daftar-transaksi'
            element={
              <TransactionPage />
            }
          />
          <Route
            path='/transaksi/:orderId'
            element={
              <ViewTransactionPage />
            }
          />
          <Route
            path='/daftar-pelanggan'
            element={
              <CustomerPage />
            }
          />
          <Route
            path='/pelanggan/:customerId'
            element={
              <ViewCustomerPage />
            }
          />
          <Route
            path='/tambah-admin'
            element={
              <CreateAdmin/>
            }
          />
          <Route
            path='/daftar-admin'
            element={
              <AdminPage/>
            }
          />
          <Route
            path='/admin/:adminId'
            element={
              <ViewAdminPage/>
            }
          />
        </Routes>
      </App>
    </Router>

  </React.StrictMode>,
)
