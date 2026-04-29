/**
 * Footer.jsx
 * 
 * Displayed at the bottom of the page on all pages. Modified from DaisyUI.
 * 
 * @author Izzy Carlson
 */

import GleebusLogo from "../assets/GleebusLogo.png";

export default function Footer(){
    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
            <aside>
                <img src={GleebusLogo} width="128" height="128"/>
                <p>
                Gleebuslings Inc.
                <br />
                Providing inclusive careers since 2026
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Job seeker Resources</a>
                <a className="link link-hover">Recruiter Resources</a>
                <a className="link link-hover">Admin Resources</a>
                <a className="link link-hover">Apply to Join Our Team</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Newsletter</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </nav>
        </footer>
    );
}