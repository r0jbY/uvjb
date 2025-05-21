import { ToastContainer } from "react-toastify";
import ClientComponent from "../Components/ClientComponent";
import NavBarComponent from "../Components/NavBarComponent";

function ClientPage() {
    
        return (
            <div className="h-[100vh] flex flex-col">
                <NavBarComponent/>
                <ClientComponent/>
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

export default ClientPage;