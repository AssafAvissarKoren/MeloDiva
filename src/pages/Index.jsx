import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Search } from './Search.jsx';
import { Library } from './Library.jsx';
import { Home } from './Home.jsx';
import { StationDetails } from './StationDetails.jsx';
import { Test } from './Test.jsx';

import { IndexContext } from '../cmps/IndexContext.jsx';
import { SideNav } from '../cmps/SideNav.jsx';
import { AppHeader } from '../cmps/AppHeader.jsx';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx'
import { FooterPlayer } from  '../cmps/FooterPlayer.jsx'

import { loadStations } from '../store/actions/station.actions.js';
import { getCurrentTrackInQueue } from '../store/actions/queue.actions.js';

import { stationService } from '../services/station.service.js';
import { categoryService } from '../services/category.service.js';
import { trackService } from '../services/track.service.js';
import { initUser } from '../store/actions/user.actions.js';
import { store } from '../store/store.js';
import { playerService } from '../services/player.service.js';


export const Index = () => {
    const params = useParams();
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));
    const [currentCategory, setCurrentCategory] = useState(null);
    
    const MIN_NAV_WIDTH = 280 // px
    let MAX_NAV_WIDTH = window.innerWidth - 650 - 20 // px
    const [isResizing, setIsResizing] = useState(false);
    const [sideNavWidth, setSideNavWidth] = useState(MIN_NAV_WIDTH)
    
    const currentTrack = useSelector(state => state.queueModule.currentTrack.track)
    
    const navigate = useNavigate();


    useEffect(() => {
        loadStationsLocal();
        initUser()
        playerService.initPlayState()
        categoryService.createCategories();
    }, []);

    useEffect(() => {
        console.log(filterBy)
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);

    useEffect(() => {
        if(isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing])

    function startResize(ev) {
        ev.preventDefault()
        setIsResizing(true)
    }

    function handleMouseMove(ev){
        if (isResizing) {
          let newNavWidth
          if(ev.clientX < MIN_NAV_WIDTH) newNavWidth = MIN_NAV_WIDTH
          else if(ev.clientX > MAX_NAV_WIDTH) newNavWidth = MAX_NAV_WIDTH
          else newNavWidth = ev.clientX

          setSideNavWidth(newNavWidth)
        }
    }

    function handleMouseUp(){
        setIsResizing(false)
    }

    async function loadStationsLocal() {
        await loadStations()
    }

    const mainViewComponentProps = {
        setCurrentCategory: setCurrentCategory,
    }; 

    let MainViewComponent;
    switch (params.tab) {
        case 'genre':
            MainViewComponent = CategoryDisplay;
            mainViewComponentProps.category = currentCategory;
            mainViewComponentProps.style = categoryService.Status.RESULTS;
            break;
        case 'station':
            MainViewComponent = StationDetails;
            break;
        case 'search':
            MainViewComponent = Search;
            mainViewComponentProps.searchText = filterBy.text;
            break;
        case 'test':
            MainViewComponent = Test;
            break;
        case 'home':
        default:
            MainViewComponent = Home;
            break;
    }

    return (
        <IndexContext.Provider value={{ setFilterBy ,setCurrentCategory }}>
            <div className="index-container">
                <div className="index-side">
                    <div className="index-side-nav" style={{width: `${sideNavWidth}px`}}>
                        <SideNav setFilterBy={setFilterBy} />
                    </div>
                    <div className="index-side-bottom" style={{width: `${sideNavWidth}px`}}>
                        <Library/>
                    </div>
                </div>
                <div className="index-side-resizer" onMouseDown={startResize}>
                    <div className={`resizer-line ${isResizing && "unhide"}`}/>
                </div>
                <div className="index-main">
                    <AppHeader filterBy={filterBy} setFilterBy={setFilterBy}/>
                    <MainViewComponent {...mainViewComponentProps} />
                </div>
                {currentTrack && <div className="index-footer-player">
                    <FooterPlayer 
                        video={trackService.trackToVideo(currentTrack)}
                    />
                </div>}
            </div>
        </IndexContext.Provider>
    );
};
