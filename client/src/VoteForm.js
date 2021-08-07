import { useState } from 'react'

export default function VoteForm(props) {
    const [selected, setSelected] = useState(1)

    const handleSubmit = e => {
        e.preventDefault()

        props.onVote(selected)
    }

    const handleSelect = e => {
        setSelected(Number(e.target.value))
    }

    if (props.candidates.length === 0) {
        return null
    }

    return (
        <div>
            <h3 className="my-4 text-left text-xl md:text-xl text-white font-bold leading-tight">Select Candidate</h3>
            <form noValidate onSubmit={handleSubmit}>
                <select onChange={handleSelect} className="px-6 py-3 bg-transparent rounded w-full border focus:outline-none">
                    {props.candidates.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                {props.canVote ? (
                    <button type="submit" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded`}>
                        Vote
                    </button>
                ) : (
                    <p className="font-bold text-sm py-2 mb-6">You already have voted.</p>
                )}

            </form>
        </div>
    )
}