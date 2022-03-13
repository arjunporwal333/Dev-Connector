import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { GetAllProfile } from "../../flux/actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = ({ GetAllProfile, profile: { profiles, loading } }) => {
    useEffect(() => {
        GetAllProfile();
    }, [GetAllProfile])
    return (
        <Fragment>
            {loading ?
                <Spinner /> :
                <Fragment>
                    <h1 className='large text-primary'>Developers</h1>
                    <p className="lead">
                        <i className="fab fa-connectdevelop"></i>{' '}Browse and Connect with Developers {' '}
                        <small style={{ fontSize: '18px' }}>( User must have a profile to show here )</small>
                    </p>
                    <div className="profiles">
                        {profiles.length > 0 ? profiles.map(prof => <ProfileItem key={prof._id} profile={prof} />) : <Spinner />}
                    </div>
                </Fragment>}
        </Fragment>
    )
}

Profiles.propTypes = {
    profile: PropTypes.object.isRequired,
    GetAllProfile: PropTypes.func.isRequired,
}
const mapStatetoProps = state => ({
    profile: state.profile
})

export default connect(mapStatetoProps, { GetAllProfile })(Profiles)
