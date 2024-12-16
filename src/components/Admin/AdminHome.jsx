import Deposit from "./components/Deposit";
import SessionsChart from "./components/SessionsChart";
import SystemWalletBalance from "./components/SystemWalletBalance";
import TotalClasses from "./components/TotalClasses";
import TotalOrdersAmount from "./components/TotalOrdersAmount";
import TransactionHistory from "./components/TransactionHistory";
import UserCount from "./components/UserCount";
const AdminHome = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-[90%] overflow-hidden p-0">
      {/* Centered container to prevent overflow */}
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Outer container with a max width */}
        <div className="grid grid-cols-4 gap-4 pb-8">
          <TotalOrdersAmount />
          <TotalClasses />
          <UserCount />
          <SystemWalletBalance />
        </div>
        <div className="flex flex-col gap-2 overflow-hidden">
          {/* Second section */}
          <TransactionHistory />
          <SessionsChart />
        </div>
        <div className="mx-auto py-8">
          {/* Center-aligned deposit section */}
          <Deposit />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
