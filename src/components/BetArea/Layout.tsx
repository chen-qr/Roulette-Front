import { useState } from 'react'
import styles from './Layout.module.css'
import BetNumberArea from '../BetNumberArea/Layout'

const BetArea = ({beginNum, endNum, lineCnt, onNumberClick}) => {
    const [selectNumber, setSelectNumber] = useState(0)
    const [isSelectBetNumber, setIsSelectBetNumber] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

    if ((endNum - beginNum + 1) % lineCnt !== 0){
        throw new Error('endNum - beginNum + 1 must be a multiple of lineCnt');
    }
    const colCnt = (endNum - beginNum + 1) / lineCnt;
    const colNums = Array.from({length: colCnt - beginNum + 1}, (_, i) => i + beginNum);
    const lineNums = Array.from({length: lineCnt}, (_, i) => i + beginNum);

    const handleOnNumberClick = (number) => {
        onNumberClick(number)
        setIsSelectBetNumber(true)
        setSelectNumber(number)
        setCurrentStep(2)
    }

    // 渲染列元素
    const renderCols = (iLine: number) => {
        // 生成列元素
        const colItems = colNums.map((iCol) => {
            const number = iCol + (iLine - 1) * colCnt;
            const color = (number + iLine) % 2 === 0 ? "red" : "black"
            return <BetNumberArea key={iCol}  color={color} number={number} onNumberClick={handleOnNumberClick}/>;
        });
        return (
            <div className={styles.colLayout}>{colItems}</div>
        );
    }
    // 渲染行元素
    const renderRows = () => {
        // 生成行元素
        const rowItems = lineNums.map((iLine) => {
            return <div key={iLine} >{renderCols(iLine)}</div>;
        });
        return (
            <div>{rowItems}</div>
        );
    }

    const getTextColor = (step) => {
        if (step > currentStep) {
            return styles.textBlack;
        } else if (step == currentStep) {
            return styles.textRed;
        } else {
            return styles.textGreed;
        }
    };

    return (
        <div>
            <div className={`${styles.stepTipsShow} ${getTextColor(1)}`}>
                {currentStep == 1 ? " 👉 Step 1. Please chose your bet number!" : `Step 1. Please chose your bet number!`}
            </div>
            {renderRows()}
            <div className={`${styles.stepTipsShow} ${getTextColor(2)}`}>
                {currentStep == 2 ? "👉 Step 2. Please set your bet amount!" : "Step 2. Please set your bet amount!"}
            </div>
            <input type="number" />
        </div>
    );    
}

export default BetArea;