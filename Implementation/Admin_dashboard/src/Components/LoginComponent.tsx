

function LoginComponent() {

    return(
        <div className="flex items-center justify-center min-h-screen bg-[#D9D9D9]">
            <div className=" w-full h-[33vh] bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 justify-center items-center">
                <input placeholder="Email" className="p-1 border-blue-600 border-2  w-1/2"></input>
                <input placeholder="Password" className="p-1 border-blue-600 border-2 w-1/2"></input>
                <button className="cursor-pointer hover:bg-red">Click</button>
            </div>
        </div>
    );
}

export default LoginComponent;