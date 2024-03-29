import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MiniMenu } from './MiniMenu'
import { toggleLikedTrack } from '../store/actions/user.actions'
import { miniMenuOptions } from './MiniMenuOptions'
import { addTrackToQueue, getCurrentTrackInQueue } from '../store/actions/queue.actions'
import { svgSvc } from "../services/svg.service"
import { PlayAnimation } from './PlayAnimation'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

export function TrackPreview(
    { 
        layout = '', 
        track = null, 
        trackNum = null, 
        isLiked, 
        deleteTrack = null, 
        duration, 
        handleTrackClick, 
        addTrackToStation
    }) {
    const [isSelected, setSelected] = useState(false)
    const [isMenu, setIsMenu] = useState(false)
    const modalRef = useRef(track.url)
    const isPlaying = useSelector(state => state.playerModule.isPlaying);
    const queueTrackNum = useSelector(state => state.queueModule.trackNum);
    const queueStationId = useSelector(state => state.queueModule.station?._id);
    const { collectionId } = useParams()

    useEffect(() => {
        if(isSelected) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)

            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }
    },[isSelected])

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            onToggleSelected(ev)
        }
    }

    function onToggleSelected(ev) { // problem with the call from handleClickOutside setting the Track, problem with de-selecting the other tracks
        setSelected(prevIsSelected => !prevIsSelected)
    }

    function onToggleLiked(ev) {
        ev.stopPropagation()
        setIsMenu(false)
        toggleLikedTrack(track)
    }

    function onAddToQueue(ev) {
        ev.stopPropagation()
        setIsMenu(false)
        addTrackToQueue(track)
    }

    async function onAddToStation(stationId) {
        setIsMenu(false)
        addTrackToStation(track, stationId)
    }

    function toggleMenu() {
        setIsMenu(prevIsMenu => !prevIsMenu)
    }

    function onCloseMiniMenu() {
        setIsMenu(false)
    }

    function onDeleteTrack() {
        deleteTrack(track.url)
    }

    function onPlayClicked(ev) {
        ev.stopPropagation()
        handleTrackClick(track)
    }
    
    const trackImgURL = track.imgUrl == "default_thumbnail_url" ? defaultImgUrl : track.imgUrl;
    const selected = (isSelected || (queueTrackNum === (trackNum - 1) && queueStationId === collectionId)) ? 'selected' : ''
    const currentTrackInQueue = getCurrentTrackInQueue()?.url === track.url ? "current-track-in-queue" : ''
    const isThisPlaying = isPlaying && currentTrackInQueue

    return (
        <section ref={modalRef} className={`track-preview ${layout} ${selected}`} onDoubleClick={onPlayClicked} onClick={onToggleSelected}>
            <div className='track-numder'>
                {isThisPlaying ?
                    <span className="action-button-wrapper track-num"> 
                        <PlayAnimation />
                    </span> 
                    :
                    <p className={`track-num ${currentTrackInQueue}`}>{trackNum}</p>
                }
                <button className="btn-track-play" onClick={onPlayClicked}>
                    <span className="action-button-wrapper"> 
                        {(isThisPlaying) ? <svgSvc.player.PauseBtn color={"white"} /> : <svgSvc.player.PlayBtn color={"white"} /> }
                    </span>
                </button>
            </div>
            <div className="track-preview-title">
                <div className="track-preview-img-container">
                    <img src={trackImgURL} className="track-preview-img"/>
                </div>
                <p className={`${currentTrackInQueue}`}>{track.title}</p>
            </div>
            {layout === 'station-search-track-layout' ?
                <div>
                    <button className="track-preview-add" onClick={() => addTrackToStation(track)}>Add</button>
                </div>
            :
                <div className="track-preview-options">
                    <button className={`btn-like-track ${isLiked && 'green'}`} onClick={onToggleLiked}>
                        <span className="action-button-wrapper"> {isLiked ? <svgSvc.track.HeartFilled/> : <svgSvc.track.HeartBlank/>}  </span>
                    </button>
                    <p>{duration}</p>
                    <button className="btn-more" onClick={toggleMenu}>
                        <p>...</p>
                    </button>
                    {isMenu && 
                        <MiniMenu location={'left bottom'} onCloseMiniMenu={onCloseMiniMenu}>
                            {miniMenuOptions.addToPlaylist(onAddToStation)}
                            { deleteTrack &&  miniMenuOptions.removeFromPlaylist(onDeleteTrack) }
                            {isLiked ? 
                                miniMenuOptions.removeFromLikedSongs(onToggleLiked) :
                                miniMenuOptions.addToLikedSongs(onToggleLiked)
                            }
                            {miniMenuOptions.addToQueue(onAddToQueue)}
                            {miniMenuOptions.hr()}
                            {miniMenuOptions.share(onCloseMiniMenu)}
                        </MiniMenu> 
                    }
                </div>
            }
        </section>
    )
}