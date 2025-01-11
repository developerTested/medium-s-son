import { Link } from 'react-router-dom';

export default function Sidebar() {

    return (
        <div className="fixed top-14 left-0 size-full flex flex-col w-60 bg-gray-800 text-white h-full">
            {/* Logo / Header */}
            <div className="p-6 text-2xl font-bold text-center bg-gray-900">
                Dashboard
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col p-4 space-y-2">
                <Link to="/" className="p-3 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200">
                    🏠 Dashboard
                </Link>
                <Link to="/posts" className="p-3 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200">
                    📑 Posts
                </Link>
                <Link to="/categories" className="p-3 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200">
                    📂 Categories
                </Link>
                <Link to="/tags" className="p-3 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200">
                    🏷️ Tags
                </Link>
                <Link to="/settings" className="p-3 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200">
                    ⚙️ Settings
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 text-sm text-center text-gray-400 bg-gray-900">
                <span>&copy; 2024 Your Blog</span>
            </div>
        </div>
    );
};
