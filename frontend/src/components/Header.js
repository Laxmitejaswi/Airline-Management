import React from 'react';

const Header = ({ heading }) => {
    return (
        <header>
            <h1 className="heading">{heading}</h1>
        </header>
    );
};

export default Header;
