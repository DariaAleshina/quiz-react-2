function StartScreen({ numQuestions }) {
    return (
        <div className="start">
            <h2>Welcome to React Quiz!</h2>
            <h3>{numQuestions} question{numQuestions !== 1 && 's'} to test your React mastery</h3>
            <button className="btn btn-ui">Let's start</button>
        </div>
    )
}

export default StartScreen
