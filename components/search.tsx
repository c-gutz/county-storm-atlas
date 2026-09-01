"use client"

import summaryStats from "../public/summary_stats.json";
import React, {useState} from "react";
import {fips_lookup} from "../components/hover"; 
import {countyIndex} from "../components/map";

let matching = [];
function searchCounties(event,season, setMatchingFull, setSearchTrigger){
    const search = event.target.value.trim().toLowerCase();
    if(search === ""){
        matching = [];
        setMatchingFull(false);
        return;
    }

    matching = countyIndex.filter((c) =>
    `${c.name}, ${c.state}`.toLowerCase().includes(search)
);
    setMatchingFull(matching.length > 0);

    // force reload
    setSearchTrigger(prev => prev+1);
}

export default function Search({season, onSelect, helper=true}) {
    const [matchingFull, setMatchingFull] = useState(false);

    // we want to reload the matching results below on every keystroke
    // however, not every keystroke changes the boolean value of matchingFull, meaning it doesnt update
    // so we create another state variables that increments every time to force a reload
    const [searchTrigger, setSearchTrigger] = useState(0);

    // if a user clicks a county from the search list, use this state variable to hide the excess results
    const [showResults, setShowResults] = useState(true);

    return (
        <div className="px-5 py-4">
            <label
                htmlFor="county-search"
                className="block text-[0.6875rem] uppercase tracking-[0.16em] text-black/40"
            >
                Find a county
            </label>

            <input
                id="county-search"
                type="search"
                autoComplete="off"
                placeholder="County name"
                className="mt-3 w-full border border-black/10 bg-white px-3 py-2 text-sm tabular-nums placeholder:text-black/35 focus:border-black/40 focus:outline-none"
                onChange={(event) => {searchCounties(event, season, setMatchingFull, setSearchTrigger); setShowResults(true);}}
                onFocus={() => setShowResults(true)}
            />
            
            {showResults && matchingFull ? (
                <ul className="mt-3 max-h-64 overflow-y-auto divide-y divide-black/10 border-y border-black/10">
                <p className="mt-2 text-[0.6875rem] tabular-nums text-black/45">
                    {matching.length} matches
                </p>
                {matching.slice(0,50).map((county) => (
                    <li key={county.geoid}>
                        <button onClick={() => {onSelect(county.geoid); setShowResults(false)}} className="flex w-full items-baseline justify-between gap-3 py-2 text-left transition-colors hover:bg-black/[0.03]">
                        <span className="min-w-0 truncate text-[0.8125rem]">
                            {county.name}
                            <span className="text-black/45">, {fips_lookup[county.geoid.slice(0,2)]}</span>
                        </span>
                        <span className="shrink-0 text-[0.6875rem] tabular-nums text-black/45">
                            {county.geoid}
                        </span>
                        </button>
                    </li>
                ))}
                </ul>
                ): 
                (helper && <p className="mt-3 text-xs text-black/50">
                    Search for a county, or hover the map to read its damage
                    distribution here.
                </p>)
            }                      
        </div>
    );
}