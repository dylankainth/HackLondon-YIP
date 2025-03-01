import { useState } from 'react'

function Header() {
    return (

        <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50 flex items-center">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">App Name</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="text-gray-700 hover:text-blue-500">Home</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-blue-500">Features</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-blue-500">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;