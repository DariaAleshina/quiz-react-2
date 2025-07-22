import { useEffect, useReducer } from 'react';
import Header from './Header.js'
import Main from './Main.js';
import Loader from './Loader.js';
import ErrorView from './ErrorView.js';
import StartScreen from './StartScreen.js';
import Question from './Question.js';
import NextButton from './NextButton.js';

const initialState = {
  questions: [],

  // status opt: loading, error, ready,  active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};
const reducer = function (state, action) {
  switch (action.type) {
    case 'dataReceived': return { ...state, questions: action.payload, status: 'ready', };
    case 'dataFailed': return { ...state, status: 'error' }
    case 'start': return { ...state, status: 'active' }
    case 'newAnswer':
      const currQuestion = state.questions[state.index];
      const newPoints = state.points + (currQuestion.correctOption === action.payload
        ? currQuestion.points
        : 0);
      return {
        ...state,
        answer: action.payload,
        points: newPoints,
      }
    case 'nextQuestion': return {
      ...state,
      index: state.index++,
      answer: null,
    }
    default: throw new Error('action unknown')
  }

}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);
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
        {status === 'ready' && <StartScreen numQuestions={numQuestions} onStart={() => dispatch({ type: 'start' })} />}
        {status === 'active' &&
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        }
      </Main>
    </div>
  );
}