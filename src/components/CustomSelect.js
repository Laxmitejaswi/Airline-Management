import React from 'react';

const CustomSelect = ({ label, selected, setSelected, showOptions, setShowOptions, search, setSearch, filteredCities }) => {
    return (
        <div className="custom-select-container" onClick={(e) => e.stopPropagation()}>
            <div className="custom-select" onClick={() => setShowOptions(!showOptions)}>
                <p id="from-to">{label}</p>
                <div className="select-selected">{selected}</div>
                {showOptions && (
                    <div className="select-items">
                        <input
                            type="text"
                            className="select-search"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {filteredCities.map(city => (
                            <div
                                key={city}
                                className="select-item"
                                onClick={() => {
                                    setSelected(city);
                                    setShowOptions(false);
                                }}
                            >
                                {city}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;