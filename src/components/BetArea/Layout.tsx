import styles from './Layout.module.css'

import BetNumberArea from '../BetNumberArea/Layout'

const BetArea = () => {
    const beginNum = 1;
    const endNum = 36;
    const nums = Array.from({length: endNum - beginNum + 1}, (_, i) => i + beginNum);
    const lineCnt = 3;
    if ((endNum - beginNum + 1) % lineCnt !== 0){
        throw new Error('endNum - beginNum + 1 must be a multiple of lineCnt');
    }
    const colCnt = (endNum - beginNum + 1) / lineCnt;

    const renderLines = () => {
        
    }

    return (
        <div>
            <BetNumberArea color={"red"} number={1}/>
            <BetNumberArea color={"black"} number={2}/>
        </div>
    );    
}

export default BetArea;