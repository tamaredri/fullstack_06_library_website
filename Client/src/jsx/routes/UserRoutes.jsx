import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import UserHome from '../components/UserHome';
import CatalogPage from '../components/CatalogPage';
import SingleBook from '../components/SingleBook';
import PersonalArea from '../components/PersonalArea';
import FallBack from '../components/FallBack';
import NavigationBar from '../components/NavigationBar';

export default function UserRoutes() {

    return (
        <>
            <NavigationBar/>
            <div style={{height:'10vh', width:'100%'}}></div>
            <Routes>
                <Route path="/home" element={<UserHome />} />
                <Route path="/personalarea" element={<PersonalArea />} />
                <Route path="/catalog">
                    <Route index element={<CatalogPage />} />
                    <Route path=":bookid" element={<SingleBook />} />
                </Route>

                <Route path="/" element={<Navigate to={`personalarea`} />} />
                <Route path="*" element={<FallBack />} />
            </Routes>
        </>
    )
}
