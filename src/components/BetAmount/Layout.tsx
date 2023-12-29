import { useState, useEffect, useRef } from 'react'
import styles from './Layout.module.css'

const BetAmount = ({}) => {
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchStartY, setTouchStartY] = useState(0)
    const [toucMoveX, setTouchMoveX] = useState(0)
    const [toucMoveY, setTouchMoveY] = useState(0)
    const [boxStartX, setBoxStartX] = useState(0)
    const [boxStartY, setBoxStartY] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)
    
    const [maxLength, setMaxLength] = useState(0)
    const [leftNum, setLeftNum] = useState(0)
    const [betRatio, setBetRatio] = useState(0.1)
    const [number, setNumber] = useState(0)

    const containRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLElement>(null);
    const proportionRef = useRef<HTMLDivElement>(null);

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

        setMaxLength(parseInt(contain.style.width.replace('px', '')))
        setTouchMoveX(e.pageX - touchStartX);
        setTouchMoveY(e.pageY - touchStartY);

        setLeftNum(boxStartX + toucMoveX);

        if (leftNum < 0) {
            setLeftNum(0);
        } else if (leftNum > 285) {
            setLeftNum(285);
        }

        proportion.style.width = (leftNum + 15) + 'px';
        
        if ((boxStartX + toucMoveX) <= 0) {
            let txt = "0%";
            // setNumber(txt)
        }
        else if( (boxStartX + toucMoveX) >= 285){
            let txt = (((leftNum + 15) / maxLength) * 100).toFixed(0) + "%";
            // setNumber(txt)
        }
        else{
            let txt = ((leftNum / maxLength) * 100).toFixed(0) + "%";
            // setNumber(txt)
        }

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
            <span>{number}</span>
        </div>
    );
};

export default BetAmount;