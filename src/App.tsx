import React, { useEffect, useState } from 'react';
import useScreenplayStore from './stores/useScreenplayStore';
import Screenplay from './components/Screenplay/Screenplay';
import fallbackScreenplay from './../screenplay.fallback.json'; // Replace with actual fallback data
import './App.css';
import { Button, Checkbox, Header, Menu, Textarea } from './components/asciicore-ui';
import MainMenu from './components/MainMenu/MainMenu'
import { menu } from './constants';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

const API_URI = 'http://localhost:3000/api/screenplay';

const App: React.FC = () => {
  const { screenplay, setScreenplay } = useScreenplayStore();
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchScreenplay = async () => {
      try {
        const response = await fetch(API_URI);
        if (!response.ok) throw new Error('Failed to fetch screenplay');
        const data = await response.json();
        setScreenplay(data); // Set fetched screenplay in store
      } catch (error) {
        console.error('Fetching screenplay failed, using fallback.', error);
        setScreenplay(fallbackScreenplay); // Use fallback screenplay
      }
    };

    fetchScreenplay();
  }, [setScreenplay]);

  if (!screenplay) return <div>Loading...</div>;

  return (
    <div className="app">
      <Header>
      {'   '}ScreenPlay
      {/* 
      <Button onClick={()=>setShowMenu(true)}>Menu</Button> <LanguageSwitcher/>
      /*/}
      </Header>
      <MainMenu menu={menu} isVisible={showMenu} onClose={()=>setShowMenu(false)}/>
      <Screenplay screenplay={screenplay} />
      <footer>
        ACSCIICORE UI Kit &copy; Mandy Mozart 2024
      </footer>
    </div>
  );
};

export default App;
