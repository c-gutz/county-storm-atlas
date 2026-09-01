"use client"
 
import React, { useEffect, useState } from "react";
import Search from "../../components/search";
import Knn, { getNearestNeighbors } from "../../components/knn";
import realtime from "../../public/realtime_data.json";

// gets the most recent month from realtime_data.json
const MONTH = realtime["month"];

export default function Analog() {
    const [geoid, setGeoid] = useState(null);
    const [analogs, setAnalogs] = useState(null);
    const [loading, setLoading] = useState(false);
 
    // the fetch lives here rather than in Knn so this page knows when a request
    // is in flight and can show the skeleton. the flag discards a stale result
    // if the county changes before the previous import resolves

    // useEffect is react's way of allowing async functions, because it runs after the page renders
    // it takes a function and a dependency array ([geoid]) that tells it when to rerun
    // it returns a cleanup function which runs only when rerunning the function (aka geoid changes)
    useEffect(() => {
        if (!geoid) return;
 
        let cancelled = false;
        setLoading(true);
        setAnalogs(null);
 
        getNearestNeighbors(5, geoid, MONTH).then((r) => {
            if (cancelled) return;
            setAnalogs(r);
            setLoading(false);
        });
 
        return () => { cancelled = true; };
    }, [geoid]);
 
    return (
        <main className="mx-auto flex w-full flex-col px-4 pb-6 pt-4 sm:px-6 lg:h-[calc(100dvh-6rem)] lg:pb-0">

            <div className="flex min-h-0 flex-col gap-6 lg:flex-1 lg:flex-row lg:items-start lg:gap-8">

                <div className="shrink-0 lg:w-[28%]">
                    <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                        ERA5-Land · Niño 3.4
                    </p>
                    <h1 className="mt-1.5 text-[1.75rem] font-semibold leading-none tracking-tight">
                        Analogs
                    </h1>
                    <p className="mt-2.5 text-sm leading-relaxed text-black/50">
                        Search for a county to see the five historic months whose
                        antecedent conditions most resemble the present, and what
                        the month that followed each of them cost.
                    </p>
                </div>

                <div className="w-full shrink-0 border border-black/10 bg-white lg:order-3 lg:w-[28%] lg:min-w-[17rem]">
                    <Search season={0} onSelect={setGeoid} helper={false}/>
                </div>

                <div className="min-h-0 w-full lg:order-2 lg:flex lg:flex-1 lg:justify-center lg:self-stretch lg:overflow-y-auto">
                    <div className="w-full lg:max-w-[26rem]">
                        {loading ? (
                            <ResultsSkeleton />
                        ) : analogs ? (
                            <Knn geoid={geoid} month={MONTH} analogs={analogs} />
                        ) : null}
                    </div>
                </div>
            </div>
 
            <p className="mt-6 shrink-0 border-t border-black/10 pt-4 text-base leading-relaxed text-black/50">
                Similarity is based on Euclidean distance across four standardized features:
                Niño 3.4, antecedent precipitation over the past three months, 2 m
                temperature anomaly, and volumetric soil water (28–100 cm).
                Candidates are restricted to the target month and the months on either
                side of it.
            </p>
        </main>
    );
}
 

function ResultsSkeleton() {
    return (
        <div className="animate-pulse border border-black/10 bg-white">
            <div className="border-b border-black/10 px-5 py-4">
                <div className="h-2 w-16 bg-black/[0.07]" />
                <div className="mt-2.5 h-3 w-32 bg-black/[0.07]" />
                <div className="mt-2 h-2 w-40 bg-black/[0.07]" />
            </div>
 
            <div className="grid grid-cols-2 divide-x divide-black/10 border-b border-black/10">
                {[0, 1].map((i) => (
                    <div key={i} className="px-5 py-4">
                        <div className="h-2 w-20 bg-black/[0.07]" />
                        <div className="mt-2.5 h-4 w-24 bg-black/[0.07]" />
                    </div>
                ))}
            </div>
 
            <ul className="divide-y divide-black/10">
                {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="h-2 w-28 bg-black/[0.07]" />
                        <div className="h-2 w-24 bg-black/[0.07]" />
                    </li>
                ))}
            </ul>
        </div>
    );
}