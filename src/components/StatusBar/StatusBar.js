import { numberTo8BitString } from "../../common/tools";

import styles from './StatusBar.module.scss';

function StatusBar({ currentByte, currentByteIndex, currentPage, totalPages, setPage, unicodeMode, toggleUnicodeMode }) {
    return (
        <div className={ styles['status-bar'] }>
            <div className={ styles['status-bar__item'] }>
                <div className={ styles['status-bar__item-title'] }>Byte index:</div>
                <div
                    className={ styles['status-bar__item-value'] }>{ currentByteIndex === -1 ? '-' : currentByteIndex }</div>
            </div>
            <div className={ styles['status-bar__item'] }>
                <div className={ styles['status-bar__item-title'] }>Decimal value:</div>
                <div className={ styles['status-bar__item-value'] }>{ currentByte || '-' }</div>
            </div>
            <div className={ styles['status-bar__item'] }>
                <div className={ styles['status-bar__item-title'] }>Binary value:</div>
                <div className={ styles['status-bar__item-value'] }>{ numberTo8BitString(currentByte) || '-' }</div>
            </div>
            <div className={ styles['status-bar__item'] }>
                <span className={ styles['status-bar__item-title'] }>Page</span>
                <input
                    type="number"
                    min={ 1 }
                    max={ totalPages }
                    value={ currentPage }
                    onChange={ handlePageChange }
                />
                <span className={ styles['status-bar__item-title'] }>of { totalPages || 0 }</span>
            </div>
            <div className={ styles['status-bar__item'] }>
                <label className={ styles['unicode-mode'] }>
                    <input type="checkbox" checked={ unicodeMode } onChange={ toggleUnicodeMode }/>
                    Unicode mode
                </label>
            </div>
        </div>
    );

    function handlePageChange(e) {
        const newPage = Number(e.target.value);
        if (1 <= newPage && newPage <= totalPages) {
            setPage(newPage);
        }
    }
}

export default StatusBar;