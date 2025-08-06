
import DashboardOverview1 from './component/DashboardOverview1'
import RecentTransactions from './component/DashboardTransaction'
import OutstandingBalances from './component/OutstandingBalances'

const ManagerDashboardOverview = () => {
  return (
    <div>
      <DashboardOverview1/>
      <RecentTransactions/>
      <OutstandingBalances/>
    </div>
  )
}

export default ManagerDashboardOverview
