import { ToastContainer } from "react-toastify";
import NavBarComponent from "../Components/NavBarComponent";
import NetworkComponent from "../Components/NetworkComponent";

function NetworkPage() {
    return (
        <div className="h-screen flex flex-col">
            <NavBarComponent />
            <div className="flex-1 overflow-y-auto">
                <NetworkComponent />
            </div>
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

export default NetworkPage;