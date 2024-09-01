import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sibedar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Addproduct from '../../Components/Addproduct/Addproduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import PrivateRoute from '../../Components/PrivateRoute/PrivateRoute';

function Admin() {
  return (
    <div className='admin'>
      <Sidebar />
      <div className='admin-content'>
        <Routes>
          <Route
            path="addproduct"
            element={
              <PrivateRoute>
                <Addproduct />
              </PrivateRoute>
            }
          />
          <Route
            path="listproduct"
            element={
              <PrivateRoute>
                <ListProduct />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
