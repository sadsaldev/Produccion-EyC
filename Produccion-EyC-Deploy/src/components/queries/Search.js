import React from "react";

export const Search = ({view, onSearchChange}) => {
    const handleInputChange = (event) => {
        onSearchChange(event.target.value);
    };
    return (
        <div className="view-grouped">
            <div className="search-insp-input">
                {view === 'table' ? (
                    <input
                        className="userfullnameinput"
                        type="text"
                        id="search-main"
                        placeholder="Buscar inspecciones"
                        onChange={handleInputChange}
                    />
                ):(
                    <input
                        className="userfullnameinput"
                        type="text"
                        id="search-grouped"
                        placeholder="Buscar inspectores"
                        onChange={handleInputChange}
                    />
                )}
            </div>
            <div className="search-insp-button">
                <button id="view-grouped-table">
                    <img src="/produccion-EyC-deploy/public/assets/img/search.svg" alt="search-icon"/>
                </button>
            </div>
        </div>
    );
}