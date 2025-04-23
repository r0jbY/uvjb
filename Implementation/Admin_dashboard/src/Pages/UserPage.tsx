import { ToastContainer } from "react-toastify";
import NavBarComponent from "../Components/NavBarComponent";
import UserComponent from "../Components/UserComponent";

function UserPage() {
    return (
        <div className="h-[100vh] flex flex-col">
            <NavBarComponent/>
            <UserComponent/>
            <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        theme="light"
        newestOnTop
        style={{ zIndex: 9999 }}
      />
        </div>
    );
}

export default UserPage;