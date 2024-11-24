import Deposit from "./components/Deposit";
import SessionsChart from "./components/SessionsChart";
import SystemWalletBalance from "./components/SystemWalletBalance";
import TotalClasses from "./components/TotalClasses";
import TotalOrdersAmount from "./components/TotalOrdersAmount";
import TransactionHistory from "./components/TransactionHistory";
import UserCount from "./components/UserCount";
const AdminHome = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full overflow-hidden">
      {" "}
      {/* Hides all overflow */}
      <div className="w-full overflow-hidden">
        {" "}
        {/* Hides both x and y overflow */}
        <div className="grid grid-cols-4 gap-4 pb-8">
          <TotalOrdersAmount />
          <TotalClasses />
          <UserCount />
          <SystemWalletBalance />
        </div>
        <div className="flex flex-col gap-2 overflow-hidden">
          {" "}
          {/* Hides overflow inside this container */}
          <SessionsChart />
          <TransactionHistory />
        </div>
        <div className="mx-auto py-8">
          <Deposit />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
