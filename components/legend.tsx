"use client"

import React from "react";
import { colorScale, MISSING_COLOR } from "./map";
import { formatDamage } from "./hover";

const COLORS = colorScale.range() as string[];

// scaleQuantile.quantiles() returns the 8 internal breaks between the 9 classes,
// so these are the real thresholds, not an even split of the domain
const BREAKS = colorScale.quantiles();

// every other boundary — all eight collide even at this width
const LABELLED = BREAKS.map((value, i) => ({ value, i })).filter(({ i }) => i % 2 === 1);

export default function Legend() {
    return (
        // pb reserves room for the absolutely positioned breakpoint labels
        <div className="mx-auto w-full max-w-[22rem] shrink-0 pb-5">
            <div className="flex items-baseline justify-between gap-4">
                <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                    Total damage
                </p>
                <span className="flex items-center gap-1.5 text-[0.6875rem] text-black/45">
                    <span
                        className="h-2 w-2 shrink-0"
                        style={{ backgroundColor: MISSING_COLOR }}
                    />
                    No data
                </span>
            </div>

            <div className="relative mt-2 h-2 w-full">
                <div className="flex h-full w-full">
                    {COLORS.map((color, i) => (
                        <span key={i} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                </div>

                {LABELLED.map(({ value, i }) => (
                    <span
                        key={i}
                        className="absolute top-3 -translate-x-1/2 whitespace-nowrap text-[0.625rem] tabular-nums text-black/45 sm:text-[0.6875rem]"
                        style={{ left: `${((i + 1) / COLORS.length) * 100}%` }}
                    >
                        {formatDamage(value)}
                    </span>
                ))}
            </div>
        </div>
    );
}