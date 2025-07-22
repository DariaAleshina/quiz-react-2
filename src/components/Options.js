function Options({ question, dispatch, answer }) {
    return (
        <div className="options">
            {question.options.map(option => <button key={option} className="btn btn-option">{option}</button>)}
        </div>
    )
}

export default Options
