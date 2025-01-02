import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Notifications = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            const companiesSnapshot = await getDocs(collection(db, 'companies'));
            const companiesList = companiesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const now = new Date();

            setCompanies(companiesList.map(company => {
                let overdue = 0;
                let today = 0;
                let nextScheduled = { type: '', date: '' };

                company.communicationDates?.forEach((comm) => {
                    const commDate = new Date(comm.date);
                    const timeDiff = Math.abs(now - commDate);
                    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

                    if (daysDiff > company.communicationPeriodicity) {
                        overdue++;
                    } else if (daysDiff <= 1) {
                        today++;
                    }
                    if (commDate > now && (nextScheduled.date === '' || commDate < new Date(nextScheduled.date))) {
                        nextScheduled = { type: comm.type, date: commDate };
                    }
                });

                return {
                    ...company,
                    overdue,
                    today,
                    nextScheduled,
                };
            }));
            setLoading(false);
        };

        fetchCompanies();
    }, []);

    return (
        <Box padding={4}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                Notifications
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress color='black' />
                </Box>
            ) : companies.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    No companies present.
                </Typography>
            ) : (
                <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Overdue Communications
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#222' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Company Name</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Next Scheduled Communication</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.filter(company => company.overdue > 0).map((company) => {
                                    return (
                                        <TableRow key={company.id}>
                                            <TableCell>
                                                <a href={company.linkedin} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                                                    {company.name}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {company.nextScheduled.date ? (
                                                    <>
                                                        {company.nextScheduled.type} - {new Date(company.nextScheduled.date).toLocaleDateString()}
                                                    </>
                                                ) : (
                                                    <Typography variant="body2">No scheduled communication</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {company.note ? (
                                                    <>
                                                        {company.note}
                                                    </>
                                                ) : (
                                                    <Typography variant="body2">No Note Define</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Today's Communications
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#222' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Company Name</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Next Scheduled Communication</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.filter(company => company.today > 0).map((company) => {
                                    return (
                                        <TableRow key={company.id}>
                                            <TableCell>
                                                <a href={company.linkedin} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                                                    {company.name}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {company.nextScheduled.date ? (
                                                    <>
                                                        {company.nextScheduled.type} - {new Date(company.nextScheduled.date).toLocaleDateString()}
                                                    </>
                                                ) : (
                                                    <Typography variant="body2">No scheduled communication</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {company.note ? (
                                                    <>
                                                        {company.note}
                                                    </>
                                                ) : (
                                                    <Typography variant="body2">No Note Define</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
};

export default Notifications;
