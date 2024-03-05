import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Components
import RecipeContainer from './components/RecipeContainer/RecipeContainer';
//

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold app-title">Recipe App</h1>
      <RecipeContainer />
    </div>
  );
}

export default App;
