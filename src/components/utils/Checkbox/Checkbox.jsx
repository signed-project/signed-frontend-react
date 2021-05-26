import React from 'react'
import classes from './Checkbox.module.css'

const Checkbox = (props) => {
  let outerStyles = props.className?props.className:'';
  return (
    <div className={classes.checkbox + " " + outerStyles}>
      <input
        type="checkbox"
        onChange={props.onChange}
        name={props.name}
        id={props.name}
        checked={props.checked || props.isChecked}
        disabled={props.disabled} />
      <label htmlFor={props.name}>{props.children}</label>
      {
        props.link &&
        <span className={props.link.className} onClick={props.link.onClick}>{props.link.text}</span>
      }
    </div>
  )
}

export default Checkbox