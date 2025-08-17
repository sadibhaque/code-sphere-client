import React, { useState } from "react";
import Hero from "./Home/Hero";
import Tags from "./Home/Tags";
import Announcement from "./Home/Announcement";
import Posts from "./Home/Posts";
import SearchResults from "./Home/SearchResults";
import Featured from "./Home/Featured";
import Promotion from "./Home/Promotion";
import Testimonials from "./Home/Testimonials";
import Newsletter from "./Home/Newsletter";

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
                <Featured />
                <Tags />
                <Announcement />
                <Promotion />
                <Posts />
                <Testimonials />
                <Newsletter />
            </>
        </div>
    );
};

export default Home;
