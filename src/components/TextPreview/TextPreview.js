import styles from './TextPreview.module.scss';

const TextPreview = ({ values }) => {
    return (
        <div className={styles.preview}>
            {[...values].map((value) => <div>{String.fromCharCode(value)}</div>)}
        </div>
    );
};

export default TextPreview;