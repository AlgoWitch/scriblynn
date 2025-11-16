
import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>✨ About Scriblyn</h1>
        <p>
          Welcome to <strong>Scriblyn</strong>, your digital space to express, connect, and be heard.
        </p>
        <p>
          Scriblyn is built on the belief that everyone has something meaningful to share — from
          thoughts and reflections to college stories and creative sparks. Whether you prefer to post
          anonymously or with your name, Scriblyn offers a safe and welcoming space to write freely.
        </p>
        <p>
          Explore real stories from fellow students, follow voices that inspire you, and discover
          communities that match your interests. We’re here to help you feel seen, supported, and
          never alone.
        </p>
        <p>
          <em>No filters. No judgment. Just honest sharing.</em>
        </p>
        <p className="signature">— Team Scriblyn 💜</p>
      </div>
    </div>
  );
}

export default AboutPage;
