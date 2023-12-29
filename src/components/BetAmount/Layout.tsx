import { useState, useEffect, useRef } from 'react'
import styles from './Layout.module.css'
import { connect } from 'http2';

const BetAmount = ({}) => {
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchStartY, setTouchStartY] = useState(0)
    const [toucMoveX, setTouchMoveX] = useState(0)
    const [toucMoveY, setTouchMoveY] = useState(0)
    const [boxStartX, setBoxStartX] = useState(0)
    const [boxStartY, setBoxStartY] = useState(0)
    const [isMouseDown, setIsMouseDown] = useState(false)

    const [number, setNumber] = useState(0)

    const containRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLElement>(null);
    const proportionRef = useRef<HTMLDivElement>(null);

    function handleBoxOnMouseDown(e) {
        setIsMouseDown(true)
        const box = boxRef.current
        
        let pageX;
        let pageY;
        if (e.type == "touchstart") {
            pageX = e.targetTouches[0].pageX
            pageY = e.targetTouches[0].pageY
        } else if (e.type == "mousedown") {
            pageX = e.pageX;
            pageY = e.pageY;
        } else {
            console.log(e)
        }

        setTouchStartX(pageX)
        setTouchStartY(pageY)

        // console.log(document.defaultView.getComputedStyle(box).left)
        setBoxStartX(parseInt(document.defaultView.getComputedStyle(box).left.replace('px', '')))
        setBoxStartY(parseInt(document.defaultView.getComputedStyle(box).top.replace('px', '')))
    };

    function handleBoxOnMouseUp(e) {
        setIsMouseDown(false)
    }

    function handleBoxOnMouseMove(e) {
        if (!isMouseDown) {
            return;
        }
        const proportion = proportionRef.current;
        const contain = containRef.current;
        const box = boxRef.current;

        let pageX;
        let pageY;
        if (e.type == "touchmove") {
            pageX = e.targetTouches[0].pageX
            pageY = e.targetTouches[0].pageY
        } else if (e.type == "mousemove") {
            pageX = e.pageX;
            pageY = e.pageY;
            setNumber(number + 1)
        } else {
            console.log(e)
        }

        setTouchMoveX(pageX - touchStartX);
        setTouchMoveY(pageY - touchStartY);
        
        let leftNum = boxStartX + toucMoveX;
        if (leftNum < 0) {
            leftNum = 0;
        } else if (leftNum > 285) {
            leftNum = 285;
        }

        proportion.style.width = (leftNum + 15) + 'px';
        // setNumber(proportion.style.width)

        // 计算百分比
        // let allWidth = $("#wrap").width();
        let allWidth = parseInt(contain.style.width.replace('px', ''));
        if ((boxStartX + toucMoveX) <= 0) {
            let txt = "0%";
            // setNumber(txt)
        }
        else if( (boxStartX + toucMoveX) >= 285){
            let txt = (((leftNum + 15) / allWidth) * 100).toFixed(0) + "%";
            // setNumber(txt)
        }
        else{
            let txt = ((leftNum / allWidth) * 100).toFixed(0) + "%";
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
                    onMouseUp={handleBoxOnMouseUp}
                ></span>
            </div>
            <span>{number}</span>
        </div>
    );
};

export default BetAmount;