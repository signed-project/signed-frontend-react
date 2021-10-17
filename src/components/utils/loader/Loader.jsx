import React from 'react'
import classes from './Loader.module.css'

const Loader = (props) => {
  return (
    <>
      {props.page ?
        <div className={classes.wrapper}>
          <div className={classes.page}><div></div><div></div><div></div><div></div></div>
        </div>
      :
        <div className={`${classes.lds_ellipsis} ${props.loaderColor === "green" ? classes.lds_ellipsis_green : ""}`}><div></div><div></div><div></div><div></div></div>
      }
    </> 
  )
}

export default Loader