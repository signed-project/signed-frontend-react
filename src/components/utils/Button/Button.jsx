import React from 'react'
import styles from './button.module.scss'
import Loader from '../loader/Loader';

/**
 * @param {string}  classNames:  - defines button style and colors
 *    Colors: clean_white, clean, primary
 *  
 */

const Button = ({ className, onClick, disabled, type, children, isLoading, loaderColor }) => {
  let buttonClasses = [styles.button]
  if (className) {
    const currentClasses = className.split(' ')
    currentClasses.forEach(type => {
      buttonClasses = [...buttonClasses, styles[type]]
    })
  }
  console.log('isLoading---------isLoading----isLoading', isLoading);
  return (
    <button
      className={buttonClasses.join(' ')}
      onClick={() => onClick()}
      disabled={disabled}
      type={type ? type : 'button'}
    >  {isLoading ? <Loader loaderColor={'white'} /> : children}
    </button>
  )
}


export default Button