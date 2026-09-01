"use client"
import realtime from "../public/realtime_data.json";
import React, { useEffect, useState } from "react";
import { formatDamage, formatDate, fips_lookup } from "../components/hover";
import {countyIndex} from "../components/map";

// needs a function that gets a county-month's five nearest neighbirs
// needs an html component display that returns the 5 in a clear way

// when a county name is clicked in analog/page.tsx, knn.tsx will get rendered with a geoid and season
// it will calculate the 5 nearest neighbors in the component and return [ changed so it gets passed analogs instead]

// js StandardScaler equivalent, just takes a z-score (z = (x-mean) / std_dev )
// only want to run the standard scaler on our features
const FEATURES = ["nino_3.4", "soil", "precip_3", "temp"]; 
const FEATURE_LABELS: Record<string, string> = {
    "nino_3.4": "Niño 3.4",
    "soil": "Soil",
    "precip_3": "Precip",
    "temp": "Temp",
};

class StandardScaler{
    mean : number[] = [];
    std : number[] = [];

    // get the mean and std dev
    fit(data){
        const n_samples = data.length;
        const n_features = FEATURES.length;
    
        // mean
        this.mean = new Array(n_features).fill(0);
        for(let i=0; i < n_samples; i++){
            for (let j=0; j < n_features; j++){
                // data[i][1][FEATURES[j]] = gets the ith entry inside the data array, the second value in that array which
                // holds the feature object, and accesses the jth feature
                this.mean[j] += data[i][1][FEATURES[j]];
            }
        }
        this.mean = this.mean.map((val) => val / n_samples); 
   

        // std dev
        this.std = new Array(n_features).fill(0);
        for (let i=0; i < n_samples; i++){
            for (let j=0; j < n_features; j++){
                const diff = data[i][1][FEATURES[j]] - this.mean[j];
                this.std[j] += diff * diff;
            }
        }
        this.std = this.std.map(val => Math.sqrt(val / n_samples) || 1.0) // avoid division by zero in the transform function
    }

    transform(data){
        return data.map(row => (
            {"geoid":row[0], "features": FEATURES.map((f,j) => (row[1][f] - this.mean[j]) / this.std[j])}
        ))
  
    }

    fitTransform(data){
        this.fit(data);
        return this.transform(data);
    }
}

function monthWindow(month) {
    const m = Number(month);
    const prev = m === 1 ? 12 : m - 1;
    const next = m === 12 ? 1 : m + 1;
    return [prev, m, next].map(n => String(n).padStart(2, "0"));
}

function nextMonth(date) {
    if (date === "2026-02") return date;

    const [year, month] = date.split("-").map(Number);
    return month === 12
        ? `${year + 1}-01`
        : `${year}-${String(month + 1).padStart(2, "0")}`;
}

// has to be async because im using dynamic importing
export async function getNearestNeighbors(n_neighbors=5, geoid="13117", month="01"){
    // only allow months before, at, or right after the current month
    const acceptable_months = monthWindow(month);

    const imported_historic_months = await import(`../public/counties/${geoid}_months.json`, {
        with: {type: "json"}
    })

    // for dynamically imported json files, the parsed json object is available under .default
    let historic_months = imported_historic_months.default
    // remove the null 1996 month
    historic_months = Object.fromEntries(
        Object.entries(imported_historic_months.default)
            .filter(([, v] : [string, any]) => v.damage !== null)
    );
    const realtime_month = (realtime["counties"][geoid]);

    // scale all features
    const standard_scaler = new StandardScaler();
    const scaled_historic_values = standard_scaler.fitTransform(Object.entries(historic_months));
    const scaled_realtime_values = standard_scaler.transform([[geoid, (realtime_month)]]);
     
    const ranked_months = scaled_historic_values.map((row) => {
        let total_score = 0;
        for (let i=0; i < 4; i++){
            total_score += ((scaled_realtime_values[0]["features"][i] - row["features"][i]) ** 2)
        }
        return [row["geoid"], Math.sqrt(total_score)];
    }).sort((a,b) => a[1] - b[1]); 
    // sorts it in ascending order, which since we're looking for the lowest distances gives most similar months first

    // disqualify entires with months that are too far apart by filtering them out
    let filtered_ranked_months = []
    for(let county_month of ranked_months){
        if(filtered_ranked_months.length >= 5){
            break;
        }

        const month = county_month[0].slice(5,);
        if(acceptable_months.includes(month)){
            filtered_ranked_months.push(county_month);
        }
    }
    // now that you have your 5 months, get their complete values directly from historic_months
    let knn_results = [];
    for(let i=0; i < 5; i++){
        const matched_month = filtered_ranked_months[i][0];
        const next_month = nextMonth(matched_month);
        knn_results.push([
            next_month,
            filtered_ranked_months[i][1],
            historic_months[next_month],
            matched_month,
            historic_months[matched_month],
        ]);
    }

    return knn_results;
}

// code below is for the knn component specifically

// each feature has its own units, so a single toFixed would be misleading
// precip is metres in the source and reads better as mm
function formatFeature(key: string, value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) return "—";
    switch (key) {
        case "precip_3": return `${Math.round(value * 1000)}mm`;
        case "soil":     return value.toFixed(3);
        case "temp":     return `${value >= 0 ? "+" : ""}${value.toFixed(2)}K`;
        default:         return value.toFixed(2);
    }
}
 
// shared by the current-conditions block and each analog's expanded panel, so
// the two are directly comparable column by column
function FeatureGrid({ values }) {
    return (
        <dl className="grid grid-cols-4 gap-x-3 text-center">
            {FEATURES.map((f) => (
                <div key={f}>
                    <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">
                        {FEATURE_LABELS[f]}
                    </dt>
                    <dd className="mt-1 text-[0.8125rem] tabular-nums">
                        {formatFeature(f, values?.[f])}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

const ORDINALS = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
];

const MONTH_NAMES: Record<string, string> = {
    "01": "January", "02": "February", "03": "March", "04": "April",
    "05": "May", "06": "June", "07": "July", "08": "August",
    "09": "September", "10": "October", "11": "November", "12": "December",
};

function countWithDamage(values: number[]): number {
    return values.filter((d) => d > 0).length;
}

export default function Knn({ geoid, month, analogs }) {
    const [openIndex, setOpenIndex] = useState(null);
    const specific_county_index = countyIndex.filter(county => county["geoid"] == geoid);
    const county_name = specific_county_index[0]["name"];
    const state = fips_lookup[geoid.slice(0, 2)];
    const current = realtime["counties"][geoid];
 
    const damages = analogs
        .map((a) => a[2]?.damage)
        .filter((d) => typeof d === "number");
 
    const withDamage = damages.filter((d) => d > 0).length;
    const low = damages.length ? Math.min(...damages) : null;
    const high = damages.length ? Math.max(...damages) : null;
 
    return (
        <div className="border border-black/10 bg-white">
 
            {/*  header  */}
            <div className="border-b border-black/10 px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                        FIPS {geoid}
                    </p>
                </div>
 
                <h2 className="mt-1.5 text-base font-semibold tracking-tight">
                    {county_name}, {state}
                </h2>
 
                <p className="mt-1 text-xs tabular-nums text-black/50">
                    {analogs.length} analogs · damage in the month that followed
                </p>
            </div>
 
            {/*  current conditions  */}
            <div className="border-b border-black/10 px-5 py-4">
                <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                    Recent conditions
                </p>
                <div className="mt-3">
                    <FeatureGrid values={current} />
                </div>
            </div>
 
            {/*  summary  */}
            <div className="grid grid-cols-2 divide-x divide-black/10 border-b border-black/10">
                <div className="px-5 py-4">
                    <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                        Months with damage
                    </p>
                    <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
                        {withDamage} of {analogs.length}
                    </p>
                </div>
                <div className="px-5 py-4">
                    <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                        Range
                    </p>
                    {/* collapse range to one value when there */}
                    <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
                        {low === high ? (
                            formatDamage(low)
                        ) : (
                            <>
                                {formatDamage(low)}
                                <span className="text-black/45"> – </span>
                                {formatDamage(high)}
                            </>
                        )}
                    </p>
                </div>
            </div>
 
            {/*  analogs  */}
            <ul className="divide-y divide-black/10">
                {analogs.map(([outcomeMonth, distance, features, matchedMonth, matchedFeatures], i) => {
                    const isOpen = openIndex === i;
                    return (
                        <li key={outcomeMonth}>
                            {/* damage stays visible collapsed; similarity moved inside */}
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                className="flex w-full cursor-pointer items-baseline justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-black/[0.03]"
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="truncate text-[0.6875rem] uppercase tracking-[0.14em] text-black/55">
                                        {ORDINALS[i]}
                                    </span>
                                    <svg
                                        viewBox="0 0 10 6"
                                        className={`h-1.5 w-2.5 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                        aria-hidden="true"
                                    >
                                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </span>
 
                                <span className="flex shrink-0 items-baseline gap-3">
                                    <span className="text-[0.6875rem] tabular-nums text-black/45">
                                        {formatDate(outcomeMonth)}
                                    </span>
                                    <span className="text-[0.8125rem] tabular-nums">
                                        {formatDamage(features?.damage)}
                                    </span>
                                </span>
                            </button>
 
                            {isOpen && (
                                <div className="px-5 pb-4">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <span className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">
                                            Distance score
                                        </span>
                                        <span className="text-[0.8125rem] tabular-nums">
                                            {distance.toFixed(2)}
                                        </span>
                                    </div>
 
                                    <div className="mt-2 flex items-baseline justify-between gap-4">
                                        <span className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">
                                            Deaths
                                        </span>
                                        {/* em dash for null, never 0  */}
                                        <span className="text-[0.8125rem] tabular-nums">
                                            {features?.death ?? "—"}
                                        </span>
                                    </div>
 
                                    {/* the conditions the match was made on, which is the
                                        month before the one whose damage is reported */}
                                    <p className="mt-3 text-[0.625rem] uppercase tracking-[0.14em] text-black/35">
                                        Conditions in {formatDate(matchedMonth)}
                                    </p>
                                    <div className="mt-2">
                                        <FeatureGrid values={matchedFeatures} />
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
 