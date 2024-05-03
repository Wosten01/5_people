import { Outlet } from "react-router-dom";
import NavigationMenu from "../components/NavMenu";

function Main() {
  return (
    <div>
      <NavigationMenu />
      <div className=" flex bg-gray-200 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
