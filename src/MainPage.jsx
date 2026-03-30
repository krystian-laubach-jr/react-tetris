import './styles/MainPage.css';
import React from "react";
import './styles/App.css';

export default function MainPage() {
  return (
    <div className="container">
      <div className="guzikiborder">
      <div className="button-column">
        <div className="border">
          <button className="btn btn1">Graj</button>
        </div>
        <div className="border">
          <button className="btn btn1">Wyniki</button>
        </div>
        <div className="border">
          <button className="btn btn1">Styl</button>
        </div>
        <div className="border">
          <button className="btn btn1">Credits</button>
        </div>
      </div>
      </div>
      <div className="tabliczka">
      <div className="border">
      <div className="side-panel">
        <h2>Panel</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
      </div>
      </div>
    </div>
  );
}
