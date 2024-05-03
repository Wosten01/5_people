import { Outlet } from "react-router-dom";
import NavigationMenu from "../src/components/NavMenu";

function Main() {
  return (
    <div>
      <NavigationMenu />
      <div className="  bg-gray-200 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
