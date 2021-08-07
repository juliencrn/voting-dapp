const classes = {
    th: "px-6 py-3 text-left text-xs font-bold text-gray-100 uppercase tracking-wider",
    td: "px-6 py-4 whitespace-nowrap"
}

export default function CandidatesTable(props) {
    if (props.candidates.length === 0) {
        return null
    }

    return (
        <div className="overflow-hidden border-gray-300 py-6">
            <table className="min-w-full divide-y divide-gray-300 border-b">
                <thead>
                    <tr>
                        <th scope="col" className={classes.th}>#</th>
                        <th scope="col" className={classes.th}>Name</th>
                        <th scope="col" className={classes.th}>Votes</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-300 border-b">
                    {props.candidates.map(({ id, name, voteCount }) => (
                        <tr key={id}>
                            <td className={classes.td}>{id}</td>
                            <td className={classes.td}>{name}</td>
                            <td className={classes.td}>{voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}