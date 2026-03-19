import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t mt-8 py-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ShopCart. All rights reserved.
        </footer>
    );
}

export default Footer;
