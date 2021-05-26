import styles from './input.module.scss';


const Input = ({ title, type, value, handleChange, name, placeholder, warning }) => {

    return (
        <div className={styles.formItem}>
            <p className={styles.title}>
                {title}

                {warning && <span className={styles.title_warning}>{warning}</span>}
            </p>

            <input
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