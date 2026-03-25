import { Outlet } from 'react-router-dom'
import bgImage from '@/assets/images/BG.png'
import Sidebar from './Sidebar'

const Dashboard = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-3 md:p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] p-2 md:h-[calc(100vh-2rem)] md:p-3">
        <Sidebar />

        <main className="ml-3 flex-1 overflow-auto md:ml-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
