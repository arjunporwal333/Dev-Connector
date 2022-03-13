import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
    if (alerts !== null && alerts.length > 0 && alerts !== undefined) {
        return (
            <Fragment>
                {
                    alerts.map(alert => (
                        <div key={alert.id.toString()} className={`alert alert-${alert.alertType}`}>
                            {alert.msg}
                        </div>
                    ))
                }
            </Fragment>
        )
    }
    else {
        return (
            <Fragment></Fragment>
        )
    }
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps, {})(Alert);
