import React from 'react';
import { useSelector } from "react-redux"
import { StationPreview } from "../cmps/StationPreview"
import { getBasicUser, getLikedTracksAsStation } from "../store/actions/user.actions"
import { stationService } from "../services/station.service"
import { getStationsInLibrary, saveStation } from "../store/actions/station.actions"
import { utilService } from "../services/util.service"
import { IndexContext } from '../cmps/IndexContext.jsx'
import { useContext } from "react"
import { svgSvc } from '../services/svg.service.jsx';


export function Library() {
    const { setFilterBy } = useContext(IndexContext)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const userId = useSelector(storeState => storeState.userModule._id)
    // const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)

    async function createNewStation() {
        const name = 'New Playlist'
        const imgUrl = utilService.getImgUrl('../assets/imgs/MeloDiva.png')
        let newStation = stationService.createStation(name, getBasicUser(), imgUrl)
        newStation = await saveStation(newStation)

        const newFilterBy = {
            tab: 'station',
            collectionId: newStation._id,
            text: '',
        }
      
        setFilterBy(prevFilterBy => ({...stationService.filterByUpdateHistory(prevFilterBy, newFilterBy)}))
    }

    if (!stations || !getBasicUser()._id) return <div>Loading...</div>
    return (
        <div className="library">
            <div className="head">
                <div className="title">
                    <span className="button-wrapper"> <svgSvc.icon.YourLibrary /> </span>
                    <p>Your Library</p>
                    <span className="action-button-wrapper add-station-btn" onClick={createNewStation}> <svgSvc.miniMenu.AddToPlaylist /> </span>
                </div>
                <div className="library-search">
                    <span className="button-wrapper"> <svgSvc.general.LibrarySearch style = {{ width: '16px', height: '16px' }} /> </span>
                    <p>Recents</p>
                    <span className="button-wrapper"> <svgSvc.sortBy.List style = {{ width: '16px', height: '16px' }} /> </span>
                </div>
            </div>
            <ul className="content">
                <li>
                    <StationPreview station={getLikedTracksAsStation()} />
                </li>
                {getStationsInLibrary().map(station => {
                    return <li key={`library${station._id}`}>
                        <StationPreview station={station} />
                    </li>
                })}
            </ul>
        </div>
    )
}
