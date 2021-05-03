import './ProgressBar.scss';

function ProgressBar({ value }) {
    return (
        <div className="progress-bar">
            <div className="progress-bar__indicator" style={{ width: `${value}%` }}/>
        </div>
    );
}

export default ProgressBar;