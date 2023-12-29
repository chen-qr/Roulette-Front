import { useState } from 'react'
import styles from './Layout.module.css'
import BetNumberArea from '../BetNumberArea/Layout'
import BetAmount from '../BetAmount/Layout'

const BetArea = ({beginNum, endNum, lineCnt, playerScore, onBetAction, onDwaringAction, handleSaveBetResult}) => {
    const [currentStep, setCurrentStep] = useState(1)
    // bet info
    const [selectedNumber, setSelectedNumber] = useState(0)
    const [betAmount, setBetAmount] = useState(0)
    const [sequenceNumber, setSequenceNumber] = useState(0)
    const [userRandomNumber, setUserRandomNumber] = useState(0)
    const [commitment, setCommitment] = useState(0)
    const [providerRandom, setProviderRandom] = useState(0)
    const [finalRandomNumber, setFinalRandomNumber] = useState(0)
    const [drawNumber, setDrawNumber] = useState(0)
    const [isWin, setIsWin] = useState(null)

    const [betActionTips, setBetActionTips] = useState("Bet")
    const [drawingActionTips, setDrawingActionTips] = useState("Drawing")
    const [twinkleNumber, setTwinkleNumber] = useState(0)
    

    if ((endNum - beginNum + 1) % lineCnt !== 0){
        throw new Error('endNum - beginNum + 1 must be a multiple of lineCnt');
    }
    const colCnt = (endNum - beginNum + 1) / lineCnt;
    const colNums = Array.from({length: colCnt - beginNum + 1}, (_, i) => i + beginNum);
    const lineNums = Array.from({length: lineCnt}, (_, i) => i + beginNum);

    const handleOnNumberClick = (number) => {
        setSelectedNumber(number)
        setCurrentStep(2)
    }

    const handleOnBetClick = (event) => {
        onBetAction(selectedNumber, betAmount, handleOnBetFinish)
        setBetActionTips("Bet ...")
    }

    const handleDrawingClick = (event) => {
        onDwaringAction(selectedNumber, betAmount, userRandomNumber, sequenceNumber, handleOnDrawingFinish)
        setDrawingActionTips("Drawing ...")
    }

    const handleOnBetFinish = (userRandomNumber, commitment, sequenceNumber) => {
        setUserRandomNumber(userRandomNumber)
        setCommitment(commitment)
        setSequenceNumber(sequenceNumber)

        setBetActionTips("Bet")
        setCurrentStep(3)
    }

    const handleOnDrawingFinish = (providerRandom, finalRandomNumber, drawNumber, isWin) => {
        setProviderRandom(providerRandom)
        setFinalRandomNumber(finalRandomNumber)
        setDrawNumber(drawNumber)
        setIsWin(isWin)
        setDrawingActionTips("Drawing")
        
        handleSaveBetResult(selectedNumber, betAmount, userRandomNumber, commitment, sequenceNumber, providerRandom, finalRandomNumber, drawNumber, isWin)
        setCurrentStep(1)
        // clear
        setSelectedNumber(0)
        setBetAmount(0)
        setUserRandomNumber(0)
        setCommitment(0)
        setSequenceNumber(0)
        setProviderRandom(0)
        setFinalRandomNumber(0)
        setDrawNumber(0)
        setIsWin(null)
    }

    // 渲染列元素
    const renderCols = (iLine: number) => {
        // 生成列元素
        const colItems = colNums.map((iCol) => {
            const number = iCol + (iLine - 1) * colCnt;
            const color = (number + iLine) % 2 === 0 ? "red" : "black"
            return <BetNumberArea key={iCol}  color={color} number={number} onNumberClick={handleOnNumberClick} currentNum={selectedNumber} twinkleNumber={twinkleNumber}/>;
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
        <div className={styles.main}>
            <div className={styles.gameTitle}>Roulette Game</div>
            <div className={`${styles.stepTipsShow} ${getTextColor(1)}`}>
                {currentStep == 1 ? " 👉 Step 1. Please chose your bet number!" : `Step 1. You have chose bet number!`}
            </div>
            <div className={styles.betNumbers}>
                {renderRows()}
            </div>
            <div className={`${styles.stepTipsShow} ${getTextColor(2)}`}>
                {currentStep == 2 ? "👉 Step 2. Please set your bet amount!" : "Step 2. You have set bet amount!"}
            </div>
            <BetAmount playerScore={playerScore} betAmount={betAmount} setBetAmount={setBetAmount}/>
            <div className={styles.betAction} onClick={handleOnBetClick}>{betActionTips}</div>

            <div className={`${styles.stepTipsShow} ${getTextColor(3)}`}>
                {currentStep == 3 ? "👉 Step 3. Please draw the winning number!" : "Step 3. Please draw the winning number!"}
            </div>

            <div>
                <div className={styles.drawingAction} onClick={handleDrawingClick}>{drawingActionTips}</div>
                <div></div>
            </div>
        </div>
    );    
}

export default BetArea;