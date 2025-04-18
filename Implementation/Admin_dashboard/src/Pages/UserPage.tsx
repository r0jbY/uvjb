import NavBarComponent from "../Components/NavBarComponent";
import UserComponent from "../Components/UserComponent";

function UserPage() {
    return (
        <div className="h-[100vh] flex flex-col">
            <NavBarComponent/>
            <UserComponent/>
        </div>
    );
}

export default UserPage;