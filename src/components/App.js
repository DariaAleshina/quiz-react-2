import { useEffect, useReducer } from 'react';
import Header from './Header.js'
import Main from './Main.js';
import Loader from './Loader.js';
import ErrorView from './ErrorView.js';
import StartScreen from './StartScreen.js';
import Question from './Question.js';
import NextButton from './NextButton.js';
import Progress from './Progress.js';
import Finished from './Finished.js';
import Footer from './Footer.js';
import Timer from './Timer.js';

const initialState = {
  questions: [],

  // status opt: loading, error, ready,  active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
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
    case 'finish': return {
      ...state,
      status: 'finished',
      highscore: state.points > state.highscore ? state.points : state.highscore,
    }
    case 'restart': return {
      ...state,
      status: 'ready',
      index: 0,
      answer: null,
      points: 0,
      secondsRemaining: 10,
    }
    case 'tick': return {
      ...state,
      secondsRemaining: state.secondsRemaining--,
      status: state.secondsRemaining === 0 ? 'finished' : state.status,
    }
    default: throw new Error('action unknown')
  }
}

export default function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce(((acc, question) => acc + question.points), 0);


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
            <Progress numQuestions={numQuestions} points={points} index={index} maxPoints={maxPoints} answer={answer} />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
            </Footer>
          </>
        }
        {status === 'finished' && <Finished points={points} maxPoints={maxPoints} highscore={highscore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}