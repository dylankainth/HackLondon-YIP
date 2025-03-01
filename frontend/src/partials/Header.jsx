import { useState } from 'react';

function Header() {
    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50 flex items-center">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">App Name</h1>
                <nav>
                    <div className="flex space-x-6">
                        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                            Log In
                        </button>
                        <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Sign Up
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;