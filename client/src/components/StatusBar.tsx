import './StatusBar.css';

interface MapStatus {
    zoom: number;
    extent: [number, number];
    centre: {p: number, q: number};
}

function StatusBar({mapStatus}: {mapStatus: MapStatus}) {
    return <div className="StatusBar">
        <div>Zoom: {mapStatus.zoom.toFixed(2)}</div>
        <div>Extent (hexes): {mapStatus.extent[0].toFixed(2)} &times; {mapStatus.extent[1].toFixed(2)}</div>
        <div>Centre (p, q): {mapStatus.centre.p.toFixed(2)}, {mapStatus.centre.q.toFixed(2)}</div>
    </div>;
}

export {MapStatus, StatusBar};
