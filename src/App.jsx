// import { useState } from 'react'
import './App.css'
import CalculateTax from './Components/Calculate'
import store from './assets/Store/store';
import { Provider } from 'react-redux';

function App() {


  return (
    <Provider store={store}>
  <CalculateTax />
  </Provider>
  )
}

export default App
