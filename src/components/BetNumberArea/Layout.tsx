import styles from './Layout.module.css'

const BetNumberArea = ({color, number, onNumberClick}) => {

    const getColor = (color) => {
        switch(color) {
            case 'red':
                return styles.araeRed
            case 'black':
                return styles.araeBlack
            default:
                return styles.araeRed
        }
    }
    
    const handleOnNumberClick = (event) => {
        onNumberClick(number)
    }

    // 判断颜色
    
    return (
        <div className={`${styles.betNumberArea} ${getColor(color)}`} onClick={handleOnNumberClick}>
            <div className={styles.betText}>
                {number}
            </div>
        </div>
    );    
    
}

export default BetNumberArea;