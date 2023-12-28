import styles from './Layout.module.css'

const BetNumberArea = ({color, number}) => {

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
    

    // 判断颜色
    
    return (
        <div className={`${styles.betNumberArea} ${getColor(color)}`}>
            <div className={styles.betText}>
                {number}
            </div>
        </div>
    );    
    
}

export default BetNumberArea;