import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {getBatchDrawingRecord} from '../../lib/RouletteGame/client'

const DrawRecord = ({walletAddress, canQuery}) => {
    const [drawRecord, setDrawRecord] = useState([])
    const [hasQueryBatchRecord, setHasQueryBatchRecord] = useState(false)
    const [blockId, setBlockId] = useState(0)

    const queryDrawRecord = async () => {
        const batchRecord = await getBatchDrawingRecord(walletAddress, blockId, 10)
        console.log(batchRecord)
        setDrawRecord(batchRecord)
        setHasQueryBatchRecord(true)
    }

    if (canQuery == true && hasQueryBatchRecord == false) {
        queryDrawRecord();
    }

    return (
        <div>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell align="right">Bet Amount</TableCell>
                            <TableCell align="right">Bet Number</TableCell>
                            <TableCell align="right">Drawing Number</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drawRecord.map((row) => (
                            <TableRow key={row.drawNo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{`${row.drawNo}`}</TableCell>
                                <TableCell align="right">{`${row.betAmount}`}</TableCell>
                                <TableCell align="right">{`${row.betNumber}`}</TableCell>
                                <TableCell align="right">{`${row.drawNumber}`}</TableCell>
                                <TableCell align="right">{`${row.isWin ? "win" : "lose"}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </div>        
    );
};

export default DrawRecord;