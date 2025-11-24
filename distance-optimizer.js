// ** distance-optimizer.js (V2 with Yardage Gain and New Branding) **
// This script automatically injects the widget into the host page.

(function() {
    // --- 1. Optimal Data Table (Launch, Spin, and Total Distance) ---
    // Total Distance (Yards) is based on standard optimal launch monitor data 
    // assuming zero wind, firm fairways, and optimized AoA.
    const OPTIMAL_DATA = [
        // { speed: MPH, launch: degrees, spin: RPM, aoa: string, distance: yards }
        { speed: 200, launch: 12.5, spin: 2300, aoa: '+6°', distance: 365 },
        { speed: 190, launch: 12.8, spin: 2300, aoa: '+4°', distance: 347 },
        { speed: 180, launch: 13.3, spin: 2200, aoa: '+4°', distance: 330 },
        { speed: 170, launch: 13.9, spin: 2250, aoa: '+8°', distance: 315 },
        { speed: 160, launch: 14.4, spin: 2250, aoa: '+6°', distance: 305 },
        { speed: 150, launch: 14.9, spin: 2250, aoa: '+6°', distance: 288 },
        { speed: 140, launch: 16.0, spin: 2200, aoa: '+8°', distance: 265 },
        { speed: 130, launch: 17.0, spin: 2150, aoa: '+8°', distance: 248 },
        { speed: 120, launch: 18.2, spin: 2100, aoa: '+8°', distance: 225 },
        { speed: 110, launch: 19.5, spin: 2050, aoa: '+8°', distance: 205 },
        { speed: 100, launch: 20.7, spin: 1950, aoa: '+10°', distance: 185 },
        { speed: 90, launch: 22.2, spin: 1900, aoa: '+10°', distance: 165 },
        { speed: 80, launch: 24.0, spin: 1700, aoa: '+10°', distance: 145 }
    ];

    const WIDGET_ID = 'distance-optimizer-tool';
    
    // --- 2. Inject Styles and Container ---
    if (document.getElementById(WIDGET_ID)) return;
    const container = document.createElement('div');
    container.id = WIDGET_ID;
    
    // Inject CUSTOMIZED CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
        #${WIDGET_ID} {
            font-family: Arial, sans-serif;
            border: 2px solid #000000; /* Primary/Black Border */
            border-radius: 8px;
            padding: 20px;
            max-width: 350px;
            margin: 20px auto;
            background-color: #FFFFFF; /* White Background */
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        #${WIDGET_ID} h3 {
            margin-top: 0;
            color: #000000; /* Black Header Text */
            text-align: center;
        }
        #${WIDGET_ID} input[type="number"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ADB4B7; /* Grey Input Border */
            border-radius: 4px;
            box-sizing: border-box;
        }
        #${WIDGET_ID} button {
            width: 100%;
            padding: 10px;
            background-color: #ED3E49; /* Red Button */
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        #${WIDGET_ID} button:hover {
            background-color: #000000; /* Black Hover */
        }
        #${WIDGET_ID} #result-output {
            margin-top: 15px;
            padding: 10px;
            border-top: 1px dashed #ADB4B7; /* Grey Divider */
            text-align: center;
        }
        #${WIDGET_ID} .result-value {
            font-size: 1.2em;
            font-weight: bold;
            color: #ED3E49; /* Red Accent */
        }
        #${WIDGET_ID} .gain-result {
            font-size: 1.5em;
            color: #ED3E49; /* Red Gain Result */
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);

    // 2.4. Inject the HTML form structure
    container.innerHTML = `
        <h3>🚀 Optimal Distance Finder</h3>
        <p>Enter your stats to find your potential distance gains.</p>
        
        <label for="ball-speed-input">1. Avg. Ball Speed (MPH):</label>
        <input type="number" id="ball-speed-input" placeholder="e.g., 150" min="80" max="200">
        
        <label for="current-distance-input">2. Current Avg. Distance (Yards):</label>
        <input type="number" id="current-distance-input" placeholder="e.g., 220" min="50">

        <button id="calculate-btn">Calculate Potential Gain</button>
        <div id="result-output"></div>
    `;

    document.body.appendChild(container);

    // --- 3. Calculation and Event Handling Logic ---

    const speedInput = document.getElementById('ball-speed-input');
    const distanceInput = document.getElementById('current-distance-input');
    const button = document.getElementById('calculate-btn');
    const output = document.getElementById('result-output');

    button.onclick = function() {
        const speed = parseFloat(speedInput.value
