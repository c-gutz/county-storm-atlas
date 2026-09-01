"use client"

import {Map , getStats} from "../components/map";
import Hover from "../components/hover";
import Legend from "../components/legend";
import Search from "../components/search";
import React, {useState} from "react";
const SEASONS = ["Winter", "Spring", "Summer", "Fall"];

export default function Home() {
  const [season, setSeason] = useState(3);
  // hover state lives here rather than in Map, because the right-hand column is
  // now a sibling of the map instead of an overlay inside it
  const [hovered, setHovered] = useState(null);

  // also need another state variable to keep track of whether theyve searched and selected a county
  const [selectedGeoid, setSelectedGeoid] = useState(null);
  const selected = selectedGeoid ? getStats(selectedGeoid, season) : undefined

  // determines whether we're showing a hovered overview or the searched one; hover takes precedence
  const shown = hovered ?? selected

  return (
    <main className="mx-auto flex w-full flex-col px-4 pb-6 pt-4 sm:px-6 lg:h-[calc(100dvh-6rem)] lg:pb-0">
      <div className="flex min-h-0 flex-col gap-6 lg:flex-1 lg:flex-row">

        <div className="flex min-h-0 flex-col lg:w-[72%]">
          <div className="shrink-0">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
              NOAA Storm Events · 1996–2026
            </p>
            <h1 className="mt-1.5 text-[1.75rem] font-semibold leading-none tracking-tight">
              Seasonal storm damage by county
            </h1>
            <p className="mt-2 max-w-[42ch] text-sm text-black/50">
              Conditional monthly damage distributions for 3,108 counties.
            </p>
          </div>

          <div className="mt-3 aspect-[975/610] min-h-0 lg:aspect-auto lg:flex-1">
            <Map width={975} height={610} season={season} onHover={setHovered} onSelect={setSelectedGeoid} />
          </div>

          <div className="mt-4 shrink-0 xl:flex xl:items-center xl:justify-center xl:gap-8">
            <Legend />

            <div className="mx-auto mt-3 flex w-full divide-x divide-black/10 border border-black/10 bg-white sm:w-fit xl:mt-0">
              {SEASONS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setSeason(i)}
                  className={`flex-1 px-2 py-2.5 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors sm:flex-none sm:px-5 sm:text-[0.8125rem] ${
                    season === i
                      ? "bg-black text-white"
                      : "text-black/45 hover:text-black/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside
          aria-label="County detail"
          className="shrink-0 border border-black/10 bg-white lg:max-h-full lg:min-w-[19rem] lg:flex-1 lg:self-start lg:overflow-y-auto">
          {shown ? <Hover data={shown} season={season} onClear={selected && !hovered ? () => setSelectedGeoid(null) : null} /> : <Search season={season} onSelect={setSelectedGeoid}/>}
        </aside>

      </div>
    </main>
  );
}