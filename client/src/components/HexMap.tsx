import {Dispatch, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import * as d3_hexbin from 'd3-hexbin';

import './HexMap.css';
import {MapStatus} from "./StatusBar";
import {HexTile, MapClient} from "../api/map";
import {HexCoord, hexToPixel, hexVec, pixelToHex} from "../api/coords";

export default function HexMap({mapClient, setMapStatus}: {mapClient: MapClient, setMapStatus: Dispatch<MapStatus>})
{
    const svgRef = useRef<SVGSVGElement>(null);
    const hexRadius = 30;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 3 * hexRadius;

    useEffect(() => {
        const svg = d3.select(svgRef.current!)
            .attr("width", width)
            .attr("height", height);
        const gridGroup = svg.append("g");
        const hexGroup = svg.append("g");
        const hexbin = d3_hexbin.hexbin().radius(hexRadius);

        function drawMapTiles(transform: d3.ZoomTransform, centre: HexCoord, extent: [number, number]) {
            mapClient.getTiles(centre, extent[0], extent[1]).then(tiles => {
                const points: [number, number][] = tiles.map((d: HexTile) => [
                    d.p * Math.sqrt(3) * hexRadius,
                    d.q * 1.5 * hexRadius
                ]);

                hexGroup.selectAll(".hexagon").remove();
                hexGroup.selectAll(".hexagon")
                    .data(hexbin(points))
                    .enter().append("path")
                    .attr("class", "hexagon")
                    .attr("d", hexbin.hexagon())
                    .attr("transform", (d, i) => {
                        let dd = hexToPixel(tiles[i], hexRadius);
                        return `translate(${dd.x},${dd.y})`
                    })
                    .style("stroke", "black")
                    .style("fill", (d, i) => tiles[i].type);
            })
            .catch(error => {
                console.error("Error fetching map data:", error);
            });
        }

        function updateGrid(transform: d3.ZoomTransform) {
            hexbin.extent([
                [-margin, -margin],
                [width / transform.k + margin, height / transform.k + margin],
            ]);
            gridGroup.selectAll("*").remove();
            gridGroup.append("path")
                .attr("d", hexbin.mesh())
                .style("fill", "none")
                .style("stroke", "#aaa");
        }

        const zoom = d3.zoom().on("zoom", (event) => {
                let t = event.transform;

                hexGroup.attr("transform", t);
                updateGrid(t);

                const endX = t.x, endY = t.y;
                const hexEnd = pixelToHex({x: endX, y: endY}, t.k * hexRadius);
                const hexDisp = hexVec( {p: 0, q: 0}, hexEnd);
                const fractionalHex = {p: hexDisp.p % 1, q: hexDisp.q % 1};
                const cartesianDisp = hexToPixel(fractionalHex, t.k * hexRadius);
                let offset_transform = new d3.ZoomTransform(
                    t.k,
                    cartesianDisp.x,
                    cartesianDisp.y,
                );//.translate(width / 2, height / 2);
                gridGroup.attr("transform", offset_transform.toString())
            })
            .on("end", (event) => {
                const centre = pixelToHex({
                    x: (width / 2 - event.transform.x) / event.transform.k,
                    y: (height / 2 - event.transform.y) / event.transform.k,
                }, hexRadius);

                const extent: [number, number] = [
                    width / (event.transform.k * hexRadius * Math.sqrt(3)),
                    // Since the tiling is packed, in the vertical direction
                    // we need to account for the overlap: essentially
                    // 2/3 of the hex height
                    2 * height / (3 * event.transform.k * hexRadius),
                ]

                drawMapTiles(event.transform, centre, extent);  // Fetch data on zoom/pan ene

                setMapStatus({
                    zoom: event.transform.k,
                    extent: [
                        width / (event.transform.k * hexRadius * Math.sqrt(3)),
                        // Since the tiling is packed, in the vertical direction
                        // we need to account for the overlap: essentially
                        // 2/3 of the hex height
                        2 * height / (3 * event.transform.k * hexRadius),
                    ],
                    centre,
                });
            });

        svg.call(zoom);

        // Set initial zoom and position
        const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2);
        svg.call(zoom.transform, initialTransform);

        return () => {
            svg.selectAll("*").remove();
        };
    }, []);

    function svgClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        // const clickPixel = {x: event.clientX, y: event.clientY};
        // const clickPoint =
        alert(`Clicked at ${event.clientX}, ${event.clientY}`);
    }

    return <svg ref={svgRef} onClick={svgClick}></svg>;
};
