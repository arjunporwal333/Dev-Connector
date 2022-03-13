import React, { Fragment } from 'react'

const Spinner = () => {
    return (
        <Fragment>
            <img src="https://miro.medium.com/max/1158/1*9EBHIOzhE1XfMYoKz1JcsQ.gif"
                style={{ width: "200px", margin: "auto", display: 'block' }} alt='Loading...'
            />
        </Fragment>
    )
}

export default Spinner;