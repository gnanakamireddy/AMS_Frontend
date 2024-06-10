import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Main } from './Employee/Main';
import AddObjectives from './Employee/AddObjectives';
import EditObjective from './Employee/EditObjectives';
import Login from './Login/Login';
import { Admin } from './Admin/Admin';
import { AddEmployee } from './Admin/AddEmployee';
import { EditEmployee } from './Admin/EditEmployee';
import axios from 'axios';
import EmployeesUnderManager from './Manager/EmployeesUnderManager';
import { ViewEmployeeObjective } from './Manager/ViewEmployeeObjective';
import { ManagerObjectives } from './Manager/ManagerObjectives';
import { ResetPassword } from './Employee/ResetPassword';
import { ForgotPassword } from './Login/ForgotPassword';
import { ApprovalPage } from './Manager/ApprovalPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState('');
    const [isManager, setIsManager] = useState(false);

    const api = process.env.REACT_APP_URL;
    useEffect(() => {
        console.log('API URL:', api);
    }, [api]);

    const authenticateUser = async (email, password) => {
        try {
            
            const adminResponse = await axios.get(`${api}/api/admin/verify`, {
                params: { email, password }
            });
            if (adminResponse.status === 200) {
                setIsAuthenticated(true);
                setUserType('admin');
                return { success: true, isManager: false, userType: 'admin' };
            }
        } catch (error) {
            console.error('Error verifying admin:', error);
        }
    
        try {
            const employeeResponse = await axios.get(`${api}/api/employee/verify`, {
                params: { email, password }
            });
            if (employeeResponse.data) {
                const { employeeId } = employeeResponse.data;
                const managerResponse = await axios.get(`${api}/api/employee/isManager/${employeeId}`);
                const isManager = managerResponse.data;
    
                setIsAuthenticated(true);
                setUserType('employee');
                setIsManager(isManager);
                return { success: true, isManager, employeeId, userType: 'employee' };
            }
        } catch (error) {
            console.error('Error verifying employee:', error);
        }
        return { success: false, isManager: false, userType: '' };
    };
    
    
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/addObjective/:employeeId" element={<AddObjectives />} />
                    <Route path='/editObjective/:employeeId/:objectiveId' element={<EditObjective />} />
                    <Route path='/viewObjective/:employeeId' element={<ViewEmployeeObjective/>} />
                    <Route path='/viewApprovalObjective/:employeeId' element={<ApprovalPage/>} />
                    <Route path='/addEmployee' element={<AddEmployee />} />
                    <Route path='/resetPassword/:employeeId' element={<ResetPassword />} />
                    <Route path='/editEmployee/:employeeId' element={<EditEmployee />} />
                    <Route path="/login" element={<Login authenticateUser={authenticateUser} />} />
                    <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                    <Route path="/employee/manager/:employeeId" element={<ManagerObjectives/>}/>
                    <Route path="/admin" element={isAuthenticated && userType === 'admin' ? <Admin /> : <Navigate to="/login" />} />
                    <Route path="/employee/:employeeId" element={isAuthenticated && userType === 'employee' ? (isManager ? <EmployeesUnderManager /> : <Main />) : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
}

export default App;
