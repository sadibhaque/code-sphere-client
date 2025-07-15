import React, { useState } from "react";
import Hero from "./Home/Hero";
import Tags from "./Home/Tags";
import Announcement from "./Home/Announcement";
import Posts from "./Home/Posts";
import SearchResults from "./Home/SearchResults";

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchResults = (results, term) => {
        setSearchResults(results);
        setSearchTerm(term);
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSearchTerm("");
    };

    return (
        <div>
            <Hero onSearchResults={handleSearchResults} />
            <SearchResults
                results={searchResults}
                searchTerm={searchTerm}
                onClearSearch={clearSearch}
            />
            <>
                <Tags />
                <Announcement />
                <Posts />
            </>
        </div>
    );
};

export default Home;
