"use client"

import React from "react";
import topoJson from "../public/counties-10m.json";
import summaryStats from "../public/summary_stats.json";
import * as d3 from "d3";
import FeatureCollection from "geojson";
import {fips_lookup} from "../components/hover"; 


// needed to convert between topojson and d3's required geojson
import {feature} from "topojson-client";
const removed_fips = ["60", "02", "15", "72", "78", "69", "66"];
const geoJson = feature(topoJson, topoJson.objects.counties);
const geoJsonFiltered = {
    type:"FeatureCollection",
    features: geoJson.features.filter(row => !removed_fips.includes(row.id.slice(0,2)))
}


// attach name and geoid to every stats row once at import, so lookups don't
// depend on Map having rendered
for (const featureItem of geoJsonFiltered.features) {
    for (let s = 0; s < 4; s++) {
        const stats = summaryStats[`${featureItem.id}-${s}`];
        if (stats) {
            stats["name"] = featureItem.properties.name;
            stats["geoid"] = featureItem.id;
        }
    }
}

// CODE FOR FINDING MISSING VALUES TO UPDATE removed_fips above
// const geoJsonGeoids = geoJsonFiltered.features.map(row => row.id);
// const summaryStatGeoids = new Set(Object.keys(summaryStats).map(row => row.slice(0,5)));
// let sep = [];
// for(let geoid of geoJsonGeoids){
//     if(!(summaryStatGeoids.has(geoid))){
//         sep.push(geoid);
//     }
// }
// console.log(sep);

// turn json object into an array with Object.values()
const damageValues = Object.values(summaryStats).map(row => row.total_damage);

// exported so the legend can read the real class boundaries off the same scale
// rather than recomputing them and risking a silent mismatch
export const colorScale = d3.scaleQuantile()
    // ... unpacks the array into indiv items
    .domain(damageValues)
    .range(d3.schemeReds[9])

export const MISSING_COLOR = "#e0e0e0";

type MapProps = {
    width: number,
    height: number,
    season: number,
    // called with the hovered county's stats, or null on mouse leave.
    // the panel is a sibling of the map now, so the state lives in the page
    onHover: (feature: any) => void
}


export function Map({width=500, height=500, season=0, onHover} : MapProps){
    const projection = d3.geoAlbersUsa().fitSize([width, height], geoJsonFiltered)
    const geoPathGenerator = d3.geoPath().projection(projection);
    return (
        <div className="h-full w-full">
            <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${width} ${height}`}>
                <g>
                {geoJsonFiltered.features.map((featureItem: any, index: number) => {
                    const stats = summaryStats[`${featureItem.id}-${season}`];

                    const value: number = stats?.total_damage;
                    const featureColor = value !== undefined ? colorScale(value) : MISSING_COLOR;

                    return (
                        <path
                            key={featureItem.id || index}
                            d={geoPathGenerator(featureItem.geometry) || undefined}
                            fill={featureColor}
                            stroke="#ffffff"     // white borders between counties
                            strokeWidth={0.5}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={onHover.bind(null, stats ?? null)}
                            onMouseLeave={onHover.bind(null, null)}
                        />
                    );
                })}
                </g>
            </svg>
        </div>
    )
}

// // export for use in  the search
// // has to be wrapped in {} bc it was previously defined
// // live binding, so variable updates change the exported value
// export {updatedSummary};

export function getStats(geoid, season){
    return summaryStats[`${geoid}-${season}`];
}

// one entry per county for search; summaryStats is keyed by county-season, so
// filtering it directly would return each county four times
export const countyIndex = geoJsonFiltered.features.map((f: any) => ({
    geoid: f.id,
    name: f.properties.name,
    state: fips_lookup[f.id.slice(0, 2)] ?? "",
}));