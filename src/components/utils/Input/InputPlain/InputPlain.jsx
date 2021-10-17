import styles from './inputPlain.module.scss';


const Input = ({ title, type, value, handleChange, name, placeholder, warning }) => {

    return (
        <div className={styles.formItem}>
            {/* <div className={styles.title}> */}
            <span className={styles.title}>{title}</span>
            {/* <span>{warning && <span className={styles.title_warning}>{warning}</span>}</span> */}
            {/* </div> */}

            <input
                placeholder={placeholder}
                type="text"
                type={type}
                className={styles.input}
                value={value}
                onChange={(e) => handleChange(e)}
                name={name}
            />

        </div >
    )
}

export default Input;