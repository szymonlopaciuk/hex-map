import {useState} from 'react';
import HexMap from './components/HexMap';
import {MapStatus, StatusBar} from './components/StatusBar';
import {MapClient} from "./api/map";

function App() {
    const [mapStatus, setMapStatus] = useState<MapStatus>({zoom: 1, extent: [0, 0], centre: {p: 0, q: 0}})

    const mapClient = new MapClient(`${process.env.REACT_APP_API_URL || ''}/api`);

    return (
        <div className="App">
            <HexMap {...{mapClient, setMapStatus}}/>
            <StatusBar {...{mapStatus}}/>
        </div>
    );
}

export default App;
