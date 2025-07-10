import React from 'react';
import Hero from './Home/Hero';
import Tags from './Home/Tags';
import Announcement from './Home/Announcement';
import Posts from './Home/Posts';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <Tags></Tags>
            <Announcement></Announcement>
            <Posts></Posts>
        </div>
    );
};

export default Home;