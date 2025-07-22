import { useEffect, useReducer } from 'react';
import Header from './Header.js'
import Main from './Main.js';
import Loader from './Loader.js';
import ErrorView from './ErrorView.js';
import StartScreen from './StartScreen.js';

const initialState = {
  questions: [],

  // status opt: loading, error, ready,  active, finished
  status: 'loading',
};
const reducer = function (state, action) {
  switch (action.type) {
    case 'dataReceived': return { ...state, questions: action.payload, status: 'ready', };
    case 'dataFailed': return { ...state, status: 'error' }
    default: throw new Error('action unknown')
  }

}

export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;


  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }));
  }, [])
  return (
    <div className='app'>
      <Header></Header>
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <ErrorView />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}