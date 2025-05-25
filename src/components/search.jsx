import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="Search" />
        <input
          type="text"
          placeholder="Tìm kiếm trong kho phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        ></input>
      </div>
    </div>
  );
};

export default Search;
