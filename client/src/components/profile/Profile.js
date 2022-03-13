import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GetProfileByID } from "../../flux/actions/profile";
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileEducation from "./ProfileEducation";
import ProfileExperience from "./ProfileExperience";
import ProfileGithub from "./ProfileGithub";

const Profile = ({ match, profile: { profile, loading }, auth, GetProfileByID }) => {
    useEffect(() => {
        GetProfileByID(match.params.id);
    }, [GetProfileByID, match.params.id])

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> :
                <Fragment>
                    <Link to='/profiles' className="btn btn-light">Back To Profiles</Link>
                    {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id ?
                        <Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link> : null}
                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />

                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.experience.length > 0 ?
                                <Fragment>
                                    {profile.experience.map(exp => (<ProfileExperience key={exp._id} experience={exp} />))}
                                </Fragment>
                                : <h4>No experience credentials </h4>}
                        </div>
                        <div className="profile-edu bg-white p-2">
                            <h2 className="text-primary">Education</h2>
                            {profile.education.length > 0 ?
                                <Fragment>
                                    {profile.education.map(edu => (<ProfileEducation key={edu._id} education={edu} />))}
                                </Fragment>
                                : <h4>No education credentials </h4>}
                        </div>
                    </div>
                    {profile.githubusername && (<ProfileGithub username={profile.githubusername} />)}
                </Fragment>
            }
        </Fragment >
    )
}

Profile.propTypes = {
    GetProfileByID: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})
export default connect(mapStateToProps, { GetProfileByID })(Profile)
