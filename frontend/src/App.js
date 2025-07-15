import React, { useState } from 'react';
import UserList from './components/UserList';
import Leaderboard from './components/Leaderboard';

function App() {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(prev => !prev);

  return (
    <div className="App font-sans">
      <Leaderboard refresh={refresh} triggerRefresh={triggerRefresh} />
    </div>
  );
}

export default App;
