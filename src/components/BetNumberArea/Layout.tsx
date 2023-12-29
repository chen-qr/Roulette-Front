import styles from './Layout.module.css'

const BetNumberArea = ({color, number, onNumberClick, currentNum, twinkleNumber}) => {

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

    const getTextColor = () => {
        if (number == twinkleNumber) {
            return styles.betTextColorTwinkle
        } else {
            return styles.betTextColorWhite
        }
    }
    
    const handleOnNumberClick = (event) => {
        onNumberClick(number)
    }

    const showIsSelected = () => {
        if (null != currentNum && 0 != currentNum && number == currentNum) {
            return <div className={styles.selected}>✓</div>
        }
    }

    // 判断颜色
    
    return (
        <div className={styles.container}>
            <div className={`${styles.betNumberArea} ${getColor(color)} ${getTextColor()}`} onClick={handleOnNumberClick}>
                <div className={styles.betText}>
                    {number}
                </div>
            </div>
            {showIsSelected()}
        </div>
    );    
    
}

export default BetNumberArea;