
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Homepage from './components/Homepage/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path='/Homepage' element={<Homepage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
