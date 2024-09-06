

export default function Navbar() {
    return (
        <div className="flex flex-row items-center justify-between p-2 mb-8">
            <div className="flex items-center text-black font-extrabold text-2xl tracking-tight">
                <div className="hover:text-blue-500 transition-colors duration-200 "><span className="text-blue-500">AIIS</span> Upload Portal</div>
            </div>
            <div className="text-gray-400 text-md tracking-tight hover:text-black transition-colors hover:shadow-2xl duration-200">
                {"Made with <3 by Mihir Sharma in Jaipur, India"}
            </div>
        </div>
    );
}