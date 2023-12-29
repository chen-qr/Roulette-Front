import { useState, useEffect, useRef } from 'react'
import styles from './Layout.module.css'

const BetAmount = ({playerScore}) => {
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchStartY, setTouchStartY] = useState(0)
    const [toucMoveX, setTouchMoveX] = useState(0)
    const [toucMoveY, setTouchMoveY] = useState(0)
    const [boxStartX, setBoxStartX] = useState(0)
    const [boxStartY, setBoxStartY] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)
    
    const [maxLength, setMaxLength] = useState(0)
    const [leftNum, setLeftNum] = useState(0)
    const [betRatio, setBetRatio] = useState(0)
    const [betAmount, setBetAmount] = useState(0)

    const containRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLElement>(null);
    const proportionRef = useRef<HTMLDivElement>(null);

    const CONTAIN_WIDTH = 300;
    const BOX_WIDTH = 15;

    function handleBoxOnMouseDown(e) {
        setIsMouseDown(true)
        const box = boxRef.current
        
        setTouchStartX(e.pageX)
        setTouchStartY(e.pageY)

        setBoxStartX(parseInt(document.defaultView.getComputedStyle(box).left.replace('px', '')))
        setBoxStartY(parseInt(document.defaultView.getComputedStyle(box).top.replace('px', '')))
    };

    function handleBoxOnMouseUpAndLeave(e) {
        setIsMouseDown(false)

        setTouchStartX(0)
        setTouchStartY(0)
        setTouchMoveX(0)
        setTouchMoveY(0)
        setBoxStartX(0)
        setBoxStartY(0)
    }

    function handleBoxOnMouseMove(e) {
        if (!isMouseDown) {
            return;
        }
        const proportion = proportionRef.current;
        const contain = containRef.current;
        const box = boxRef.current;

        setMaxLength(parseInt(document.defaultView.getComputedStyle(contain).width.replace('px', '')))
        setTouchMoveX(e.pageX - touchStartX);
        setTouchMoveY(e.pageY - touchStartY);

        setLeftNum(boxStartX + toucMoveX);

        if (leftNum < 0) {
            setLeftNum(0);
        } else if (leftNum > (CONTAIN_WIDTH - BOX_WIDTH)) {
            setLeftNum(CONTAIN_WIDTH - BOX_WIDTH);
        }

        let amount;
        let ratio;
        if (leftNum <= 0) {
            ratio = 0
            amount = 0
        }
        else if( leftNum >= CONTAIN_WIDTH - BOX_WIDTH){
            ratio = 1
            amount = playerScore
        }
        else{
            ratio = leftNum / maxLength
            amount = playerScore * (leftNum / maxLength)
        }
        setBetRatio(ratio)
        setBetAmount(parseInt(amount))

        // 进度条背景
        proportion.style.width = (leftNum + BOX_WIDTH) + 'px';
        // 拖拽按钮
        box.style.left = leftNum + 'px';
    };

    return (
        <div>
            <div ref={containRef} className={styles.percentContain}>
                <div ref={proportionRef} className={styles.percentProportion}></div>
                <span ref={boxRef} className={styles.percentBox} 
                    onMouseDown={handleBoxOnMouseDown}
                    onMouseMove={handleBoxOnMouseMove}
                    onMouseUp={handleBoxOnMouseUpAndLeave}
                    onMouseLeave={handleBoxOnMouseUpAndLeave}
                ></span>
            </div>
            <span>{(betRatio * 100).toFixed(0) + "%"} {betAmount.toLocaleString()}</span>
        </div>
    );
};

export default BetAmount;