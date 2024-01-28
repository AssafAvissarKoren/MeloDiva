import { stationService } from "../../services/station.service";
import { trackService } from "../../services/track.service";
import { ADD_STATION, REMOVE_STATION, SET_FILTER_BY, SET_IS_LOADING, SET_STATIONS, 
    UPDATE_STATION, } from "../reducers/station.reducer";
import { store } from "../store";


export async function loadStations() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const filterBy = store.getState().stationModule.filterBy
    try {
        const stations = await stationService.getStations(filterBy)
        store.dispatch({ type: SET_STATIONS, stations })
        return stations
    } catch (err) {
        console.log('Had issues loading stations', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function getStationById(stationId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        return await stationService.getById(stationId)
    } catch (err) {
        console.log('Had issues Getting station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeStation(stationId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await stationService.removeById(stationId)
        store.dispatch({ type: REMOVE_STATION, stationId })
    } catch (err) {
        console.log('Had issues Removing station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function saveStation(stationToSave) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const type = stationToSave._id ? UPDATE_STATION : ADD_STATION
    try {
        const station = await stationService.saveStation(stationToSave)
        store.dispatch({ type, station: station })
    } catch (err) {
        console.log('Had issues saving station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function setIsLoading(isLoading) {
    store.dispatch({ type: SET_IS_LOADING, isLoading })
}

export async function getStations() {
    return await stationService.getStations()
}