import Options from "./Options";

function Question({ question, dispatch, answer }) {
    // const { id, question, options, correctOption, points } = currentQuestion;
    return (
        <div>
            <h4>{question.question}</h4>
            <Options question={question} dispatch={dispatch} answer={answer} />
        </div>
    )
}
export default Question
