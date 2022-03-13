import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment";
import { deleteExperience } from "../../flux/actions/profile";
import { connect } from "react-redux";

const Experience = ({ experience, deleteExperience }) => {

    const allExperiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                <Moment format='YYYY//MM/DD'>{exp.from}</Moment>{' '} -{' '}
                {exp.to === null ? ('NOW') : (<Moment format='YYYY//MM/DD'>{exp.to}</Moment>)}
            </td>
            <td>
                <button onClick={() => deleteExperience(exp._id)} className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ))

    return (
        <Fragment>
            <h1 className="my-2">Experience Credentials</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{allExperiences}</tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    deleteExperience: PropTypes.func.isRequired,
    experience: PropTypes.array.isRequired,
}

export default connect(null, { deleteExperience })(Experience);
