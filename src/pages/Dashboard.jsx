import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'
const Dashboard = () => {
    const { loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)

    if (authLoading || profileLoading) {
        console.log(authLoading)
        return (
            
            <div className='spinner mx-auto translate-y-[25rem]'></div>
        )
    }
    return (
        <div>
            <div className='relative flex min-h-[calc(100vh-3.5rem)] text-white '>
                <Sidebar />
                <div className='min-h-[calc(100vh-3.5rem)] w-8/12 overflow-auto'>
                    <div className='mx-auto w-11/12 py-10'>
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard