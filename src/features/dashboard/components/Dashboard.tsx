import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-3 md:p-4">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)]  rounded-[2rem] bg-muted/25 p-2 md:h-[calc(100vh-2rem)] md:p-3">
        <Sidebar />

        <main className="ml-3 flex-1 overflow-auto rounded-[2rem] border border-border bg-background p-5 md:ml-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard