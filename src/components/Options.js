function Options({ question, dispatch, answer }) {
    const hasAnswered = answer !== null;
    return (
        <div className="options">
            {question.options.map((option, i) =>
                <button
                    key={option}
                    disabled={hasAnswered}
                    className={`
                        btn btn-option 
                        ${i === answer ? 'answer' : ''} 
                        ${hasAnswered && (i === question.correctOption
                            ? 'correct'
                            : 'wrong'
                        )}
                        `}
                    onClick={() => dispatch({ type: 'newAnswer', payload: i })}
                >
                    {option}
                </button>)}
        </div>
    )
}

export default Options
