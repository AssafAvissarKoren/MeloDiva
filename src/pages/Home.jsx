import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { useSelector } from 'react-redux';
import { StationPreview } from '../cmps/StationPreview';

export function Home({ }) {
    const [categories, setCategories] = useState([]);
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, []);

    function getHeadStations(stationNum) {
        return stations.slice(0, stationNum).map((station) =>
            <StationPreview key={`home-head ${station._id}`} station={station} style={"home-head"} />
        )
    }

    if (!stations || !categories.length) return <div style={{ color: "white" }}>Loading...</div>;
    
    return (
        <section className="home">
            <div className='head-stations'>
                {getHeadStations(6)}
            </div>
            <div className='category-display'>
                {categories.map(category => (
                    <CategoryDisplay 
                        key={category._id}
                        category={category}
                        style={categoryService.Status.ROW}
                    />
                ))}
            </div>
        </section>
    );
}
