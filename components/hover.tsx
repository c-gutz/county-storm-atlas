export function formatDamage(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) return "—";
    if (value === 0) return "$0";

    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    const [divisor, suffix] =
        abs >= 1e9 ? [1e9, "B"] :
        abs >= 1e6 ? [1e6, "M"] :
        abs >= 1e3 ? [1e3, "K"] :
        [1, ""];

    const scaled = abs / divisor;
    // 3 significant figures
    const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;

    return `${sign}$${scaled.toFixed(decimals)}${suffix}`;
}

export function formatDate(value: string): string {
    if (value !== null){
        const year : string = value.slice(0,4);
        const month : string = value.slice(5)
        return month_lookup[month] + " " + year;
    } else{
        return "";
    }
}

const month_lookup : Record<string,string> = {
    "01": "Jan", 
    "02" : "Feb",
    "03": "Mar", 
    "04": "Apr",
    "05": "May",
    "06": "Jun", 
    "07": "Jul", 
    "08": "Aug", 
    "09": "Sept",
    "10": "Oct",
    "11": "Nov", 
    "12": "Dec"
}

const season_lookup = {
    0: "Winter",
    1: "Spring",
    2: "Summer",
    3: "Fall"
}

export const fips_lookup: Record<string, string> = {
  "01": "AL",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
};
// wrap parameters in {} to destructure the props object
// react components dont return multiple individual parameters, just one object
export default function Hover({data, season, onClear}){
    // undefined for a county outside the contiguous US, in which case the name
    // renders alone rather than as "Morgan, undefined"
    const state = fips_lookup[data.geoid.slice(0,2)];

    return (
        // the border, background and width now belong to the column in page.tsx,
        // so the search state and this state share one frame
        <div>
        {/*  header */}
        <div className="border-b border-black/10 px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                FIPS {data.geoid}
            </p>
            {onClear ? (
                <button onClick={onClear}
                className="bg-black px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-black/80">
                Clear
                </button>
            ) : (
                <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                {season_lookup[season]}
                </p>
            )}
            </div>

            <h2 className="mt-2 text-base font-semibold tracking-tight">
                {data.name}, {state}
            </h2>

            <p className="mt-1 text-xs tabular-nums text-black/50">
            {data.n_events} events · {data.n_months} months of record
            </p>
        </div>

        {/* damage */}
        <div className="grid grid-cols-2 divide-x divide-black/10 border-b border-black/10">
            <div className="px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                Property damage
            </p>
            <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
                {formatDamage(data.total_damage)}
            </p>
            </div>
            <div className="px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                Largest event
            </p>
            <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
                {formatDamage(data.max_damage)}
            </p>
            <p className="mt-0.5 text-[0.6875rem] tabular-nums text-black/45">
                {formatDate(data.max_damage_date)}
            </p>
            </div>
        </div>

        {/*  monthly damage quantiles  */}
        <div className="border-b border-black/10 px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
            Conditional Monthly damage
            </p>
            <dl className="mt-3 grid grid-cols-4 gap-x-3 text-center">
            <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">p50</dt>
                <dd className="mt-1 text-[0.8125rem] tabular-nums">{formatDamage(data.quantiles.q50)}</dd>
            </div>
            <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">p75</dt>
                <dd className="mt-1 text-[0.8125rem] tabular-nums">{formatDamage(data.quantiles.q75)}</dd>
            </div>
            {/* null to em dash, so the grid never collapses */}
            <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">p90</dt>
                <dd className="mt-1 text-[0.8125rem] tabular-nums">{formatDamage(data.quantiles.q90)}</dd>
            </div>
            <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-black/35">p95</dt>
                <dd className="mt-1 text-[0.8125rem] tabular-nums">{formatDamage(data.quantiles.q95)}</dd>
            </div>
            </dl>
            <p className="mt-3 text-[0.6875rem] tabular-nums text-black/45">
                {Math.round(data.p_damage * 10000) / 100}% of months record damage
            </p>
        </div>

        {/*  exceedance probabilities 
            bar widths are absolute: the full track is 100% probability, never
            normalized to the largest value in the group. */}
        <div className="border-b border-black/10 px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                Chance of exceeding
            </p>
            <ul className="mt-3 space-y-2">
                {(() => {
                const rows = [
                    { label: "$10K",  p: data.exceedances.p_10k  },
                    { label: "$100K", p: data.exceedances.p_100k },
                    { label: "$1M",   p: data.exceedances.p_1m   },
                    { label: "$10M",  p: data.exceedances.p_10m  },
                ];

                return rows.map(({ label, p }) => {
                    const pct = (p ?? 0) * 100;
                    // absolute: full bar = 100% probability
                    const width = p && p > 0 ? Math.max(pct, 0.75) : 0;

                    return (
                    <li key={label} className="flex items-center gap-3">
                        <span className="w-9 shrink-0 text-[0.6875rem] tabular-nums text-black/55">
                        {label}
                        </span>
                        <span className="h-1 flex-1 bg-black/[0.07]">
                        <span className="block h-full bg-black" style={{ width: `${width}%` }} />
                        </span>
                        <span className="w-10 shrink-0 text-right text-[0.6875rem] tabular-nums">
                        {pct.toFixed(1)}%
                        </span>
                    </li>
                    );
                });
                })()}
            </ul>
        </div>

        {/*  event mix 
            shows categories over 1%, or the top 3 if fewer than 3 clear that bar.
            Bar widths are the actual shares, so a visible remainder means the
            displayed categories don't account for everything. */}
        {(() => {
        const LABELS: Record<string, string> = {
            convective_share: "Convective",
            flood_share: "Flood",
            winter_share: "Winter",
            wind_share: "Wind",
            tropical_share: "Tropical",
            coastal_share: "Coastal",
            heat_share: "Heat",
            fire_share: "Fire",
            other_share: "Other",
        };

        const all = Object.entries(data.event_shares ?? {})
            .filter(([k, v]) => k in LABELS && typeof v === "number" && v > 0)
            .map(([k, v]) => ({ label: LABELS[k], share: v as number }))
            .sort((a, b) => b.share - a.share);

        if (all.length === 0) return null;

        const overOnePct = all.filter(r => r.share >= 0.01);
        const shown = overOnePct.length >= 3 ? overOnePct : all.slice(0, 3);

        const accounted = shown.reduce((s, r) => s + r.share, 0);
        const remainder = Math.max(1 - accounted, 0);

        const OPACITY = ["bg-black", "bg-black/60", "bg-black/35", "bg-black/20", "bg-black/12"];
        const swatch = (i: number) => OPACITY[Math.min(i, OPACITY.length - 1)];

        const fmt = (v: number) => {
            const p = v * 100;
            return p >= 10 ? `${Math.round(p)}%` : p >= 1 ? `${p.toFixed(1)}%` : "<1%";
        };

        return (
            <div className="border-b border-black/10 px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
                Event mix
            </p>

            <div className="mt-3 flex h-1.5 w-full gap-px overflow-hidden bg-black/[0.07]">
                {shown.map((r, i) => (
                <span
                    key={r.label}
                    className={`h-full ${swatch(i)}`}
                    style={{ width: `${Math.max(r.share * 100, 0.5)}%` }}
                    title={`${r.label} ${fmt(r.share)}`}
                />
                ))}
                {remainder > 0.005 && (
                <span
                    className="h-full bg-black/[0.07]"
                    style={{ width: `${remainder * 100}%` }}
                    title={`Other ${fmt(remainder)}`}
                />
                )}
            </div>

            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {shown.map((r, i) => (
                <li
                    key={r.label}
                    className="flex min-w-0 items-center gap-1.5 text-[0.6875rem] tabular-nums"
                >
                    <span className={`h-1.5 w-1.5 shrink-0 ${swatch(i)}`} />
                    <span className="truncate">{r.label}</span>
                    <span className="shrink-0 text-black/45">{fmt(r.share)}</span>
                </li>
                ))}
                {remainder > 0.005 && (
                <li className="flex items-center gap-1.5 text-[0.6875rem] tabular-nums text-black/45">
                    <span className="h-1.5 w-1.5 shrink-0 bg-black/[0.07] ring-1 ring-inset ring-black/10" />
                    <span>Other</span>
                    <span>{fmt(remainder)}</span>
                </li>
                )}
            </ul>
            </div>
        );
        })()}

        {/*  fatalities  */}
        <div className="px-5 py-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-black/40">
            Fatalities
            </p>
            <div className="mt-2 flex items-baseline justify-between gap-4">
            <p className="text-sm tabular-nums">
                {data.deaths.total_death} total 
                {data.deaths.max_death > 0 && (
                    <span className="text-black/45"> · {data.deaths.max_death} in {formatDate(data.deaths.max_death_date)}</span>
                )}
            </p>
            <p className="text-[0.6875rem] tabular-nums text-black/45">{Math.round(data.deaths.p_death * 10000) / 100 }% of months</p>
            </div>
        </div>
        </div>
    )
}