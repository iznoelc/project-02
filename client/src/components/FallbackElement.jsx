/**
 * FallbackElement.jsx
 * 
 * Element that is displayed when contents or authentication of a page are still loading.
 * Asset from Uiverse.io by JkHuger.
 * 
 * @author Izzy Carlson
 */

import "../styles/loader.css";

export default function FallbackElement() {
    return (
        <>
        <div className="flex flex-col items-center justify-center p-16">
        <h1 className="text-4xl font-bold mb-4">PLEASE <span className="text-info">WAIT</span> WHILE WE LOAD...</h1>
            <div className="flex justify-center items-center">
                <div className="astronaut">
                    <div className="schoolbag"></div>
                    <div className="head"></div>
                    <div className="body">
                        <div className="panel"></div>
                    </div>
                    <div className="arm arm-left"></div>
                    <div className="arm arm-right"></div>
                    <div className="leg leg-left"></div>
                    <div className="leg leg-right"></div>
                </div>
            </div>

            </div>
        </>
    );
}