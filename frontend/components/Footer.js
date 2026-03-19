import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 mt-8 py-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ShopCart. All rights reserved.
        </footer>
    );
}

export default Footer;
