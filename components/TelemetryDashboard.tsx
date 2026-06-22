"use client";
import './dashboard.css'
import './dashboard-lightmode.css'
import Image from 'next/image';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type TelemetryRecord = {
    id: number;
    timestamp: string;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
};

const ISS_API = "https://api.wheretheiss.at/v1/satellites/25544";
const RECORDS_PER_PAGE = 10;
const POLL_INTERVAL = 10000;

export default function TelemetryDashboard() {
    const [history, setHistory] = useState<TelemetryRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);
    const router = useRouter();

    async function fetchTelemetry() {
        try {
            const { data } = await axios.get(ISS_API);
            const record: TelemetryRecord = {
                id: ++counterRef.current,
                timestamp: new Date().toLocaleTimeString(),
                latitude: parseFloat(data.latitude.toFixed(4)),
                longitude: parseFloat(data.longitude.toFixed(4)),
                altitude: parseFloat(data.altitude.toFixed(2)),
                velocity: parseFloat(data.velocity.toFixed(2)),
            };
            setHistory((prev) => [record, ...prev]);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch ISS data:", err);
        }
    }

    useEffect(() => {
        fetchTelemetry();

        //log every 10 seconds
        intervalRef.current = setInterval(fetchTelemetry, POLL_INTERVAL);

        // cleanup
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);


    function handleLogout() {
        if (intervalRef.current) clearInterval(intervalRef.current);
        Cookies.remove("auth_token");
        router.push("/login");
    }

    //Pagination
    const totalPages = Math.ceil(history.length / RECORDS_PER_PAGE);
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    const currentRecords = history.slice(startIndex, startIndex + RECORDS_PER_PAGE);

    useEffect(() => {
        if (history.length <= RECORDS_PER_PAGE) {
            setCurrentPage(1); // only reset on first page fill
        }
    }, [totalPages]);



    if (loading) return <p className="loading-text">Connecting to ISS...</p>;


    return (
        <div className={isDark ? "container" : "container2"}>
            <header className={isDark? "header" : "header2"}>
                <label className="switch">

                    <input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)}/>
                    {isDark? "Light" : "Dark"}
                    <span className="slider"></span>
                </label>
                <img src="/images.png"/>
                <h1>ISS Live Telemetry Log</h1>
                <button id={isDark? "logout-button": "logout-button2"} onClick={handleLogout}>Logout</button>
            </header>
            <p className={isDark? "records-top": "records-top2"}>Total records: {history.length} | Updating every 10s</p>

            <table className={isDark? "table" : "table2"}>
                <thead>
                <tr className={isDark ? "table-head": "table-head2"}>
                    <th className={isDark ? "table-heading" : "table-heading2"}>S.No.</th>
                    <th className={isDark ? "table-heading" : "table-heading2"}>Time</th>
                    <th className={isDark ? "table-heading" : "table-heading2"}>Latitude</th>
                    <th className={isDark ? "table-heading" : "table-heading2"}>Longitude</th>
                    <th className={isDark ? "table-heading" : "table-heading2"}>Altitude (km)</th>
                    <th className={isDark ? "table-heading" : "table-heading2"}>Velocity (km/h)</th>
                </tr>
                </thead>
                <tbody>
                {currentRecords.map((record) => (
                    <tr className={isDark? "table-row": "table-row2"} key={record.id}>
                        <td className="table-data">{record.id}</td>
                        <td className="table-data">{record.timestamp}</td>
                        <td className="table-data">{record.latitude}°</td>
                        <td className="table-data">{record.longitude}°</td>
                        <td className="table-data">{record.altitude}</td>
                        <td className="table-data">{record.velocity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={isDark? "dashboard-footer": "dashboard-footer2"}>
                <button className={isDark? "prev-button": "prev-button2"}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>
                <span className={isDark? "page-count" : "page-count2"}>Page {currentPage} of {totalPages}</span>
                <button className={isDark? "next-button" : "next-button2"}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}