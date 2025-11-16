import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms</a>
      </div>
      <div className="socials">
        <span>Follow us → </span>
        <a href="https://instagram.com" target="_blank"  rel="noopener">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <p className="copyright">© 2025 Scriblyn. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
