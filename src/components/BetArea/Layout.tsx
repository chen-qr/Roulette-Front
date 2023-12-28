import styles from './Layout.module.css'

import BetNumberArea from '../BetNumberArea/Layout'

const BetArea = () => {
    return (
        <div>
            <BetNumberArea color={"red"} number={1}/>
            <BetNumberArea color={"black"} number={2}/>
        </div>
    );    
}

export default BetArea;