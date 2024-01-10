import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {getBatchDrawingRecord} from '../../lib/RouletteGame/client'

const DrawRecord = ({walletAddress, canQuery}) => {
    const [drawRecord, setDrawRecord] = useState([])
    const [hasQueryBatchRecord, setHasQueryBatchRecord] = useState(false)
    const [blockId, setBlockId] = useState(0)

    const queryDrawRecord = async () => {
        const batchRecord = await getBatchDrawingRecord(walletAddress, blockId, 10)
        console.log(batchRecord)
        console.log("啦啦啦")
        setHasQueryBatchRecord(true)
    }

    if (canQuery == true && hasQueryBatchRecord == false) {
        queryDrawRecord();
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Bet Amount</TableCell>
                            <TableCell align="right">Bet Number</TableCell>
                            <TableCell align="right">Drawing Number</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drawRecord.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>        
    );
};

export default DrawRecord;