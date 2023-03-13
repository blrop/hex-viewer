import styles from './ProgressBar.module.scss';

function ProgressBar({ value }) {
    return (
        <div className={styles.progressBar}>
            <div className={styles.progressBar__indicator} style={{ width: `${value}%` }}/>
        </div>
    );
}

export default ProgressBar;