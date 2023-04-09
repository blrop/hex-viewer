import { numberTo8BitString } from "../../common/tools";

import styles from './StatusBar.module.scss';

function StatusBar({ currentByte, currentByteIndex }) {
    return (
        <div className={styles['status-bar']}>
            <div className={styles['status-bar__item']}>
                <div className={styles['status-bar__item-title']}>Byte index:</div>
                <div className={styles['status-bar__item-value']}>{ currentByteIndex }</div>
            </div>
            <div className={styles['status-bar__item']}>
                <div className={styles['status-bar__item-title']}>Binary value:</div>
                <div className={styles['status-bar__item-value']}>{ numberTo8BitString(currentByte) }</div>
            </div>
        </div>
    );
}

export default StatusBar;