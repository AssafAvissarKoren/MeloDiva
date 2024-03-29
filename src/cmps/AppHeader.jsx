import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { utilService } from '../services/util.service.js';
import { svgSvc } from '../services/svg.service.jsx';

export const AppHeader = ({ filterBy, setFilterBy }) => {
    const params = useParams();
    const [text, setText] = useState('');
    const typingTimeoutRef = useRef(null);
    
    useEffect(() => {
        if (params.tab === "search") {
            setText('');
            setFilterBy(prev => ({ ...prev, text: '' }));
        }
    }, [params.tab]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        clearTimeout(typingTimeoutRef.current); // Clear the previous typing timeout
        typingTimeoutRef.current = setTimeout(() => {
            setFilterBy(prev => ({ ...prev, text: newText }));
        }, 1000); // Set a new typing timeout
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            clearTimeout(typingTimeoutRef.current); // Clear the typing timeout if "Enter" is pressed
            setFilterBy(prev => ({ ...prev, text }));
        }
    };

    function clearSearch() {
        setText('')
        setFilterBy(prev => ({ ...prev, text: '' }))
    }

    function navigateBack() {
        let { tabHistory, tabHistoryLoc } = filterBy
        var tab, collectionId
        tabHistoryLoc--
        if(tabHistory[tabHistoryLoc].includes("station") || tabHistory[tabHistoryLoc].includes("genre")) {
            [ tab, collectionId ] =  tabHistory[tabHistoryLoc].split(' ')
        } else {
            tab = tabHistory[tabHistoryLoc]
            collectionId = ''
        }
        setFilterBy({
            tab: tab,
            collectionId: collectionId,
            text: '',
            tabHistory: [...tabHistory], 
            tabHistoryLoc: tabHistoryLoc
        })
    }

    function navigateForward() {
        let { tabHistory, tabHistoryLoc } = filterBy
        var tab, collectionId
        tabHistoryLoc++
        if(tabHistory[tabHistoryLoc].includes("station") || tabHistory[tabHistoryLoc].includes("genre")) {
            [ tab, collectionId ] =  tabHistory[tabHistoryLoc].split(' ')
        } else {
            tab = tabHistory[tabHistoryLoc]
            collectionId = ''
        }
        setFilterBy({
            tab: tab,
            collectionId: collectionId,
            text: '',
            tabHistory: [...tabHistory], 
            tabHistoryLoc: tabHistoryLoc
        })
    }

    const isBackHistory = filterBy.tabHistoryLoc
    const isForwardHistory = filterBy.tabHistoryLoc < filterBy.tabHistory.length - 1
    return (
        <header className="app-header">
            <div className="arrow-options">
                <button className={`btn-arrow-container ${!isBackHistory && "disabled"}`} disabled={!isBackHistory} onClick={navigateBack}>
                    <span className="action-button-wrapper"> <svgSvc.general.DirectionLeft /> </span>
                </button>
                <button className={`btn-arrow-container ${!isForwardHistory && "disabled"}`} disabled={!isForwardHistory} onClick={navigateForward}>
                    <span className="action-button-wrapper"> <svgSvc.general.DirectionRight /> </span>
                </button>
            </div>
            {params.tab == "search" &&
                <label className="search-bar-container">
                    <div className="img-container">
                        <svgSvc.general.LibrarySearch />
                    </div>
                    <input 
                        className="search-bar"
                        type="text" 
                        placeholder="What do you want to play?" 
                        value={text} 
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                    />
                    {text &&
                        <div className="img-container" onClick={clearSearch}>
                            <svgSvc.miniMenu.Ex />
                        </div>
                    }
                </label>
            }
        </header>
    )
};
