import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Tooltip, Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CommunicationAction from './CommunicationAction';
import { db } from '../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [overdueCount, setOverdueCount] = useState(0);
    const [dueTodayCount, setDueTodayCount] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'companies'), (companiesSnapshot) => {
            setLoading(true);
            const companiesList = companiesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const now = new Date();
            let overdueCountTemp = 0;
            let dueTodayCountTemp = 0;

            setCompanies(companiesList.map(company => {
                let overdue = 0;
                let today = 0;
                let nextScheduled = { type: '', date: '' };

                company.communicationDates?.forEach((comm) => {
                    const commDate = new Date(comm.date);
                    const timeDiff = Math.abs(now - commDate);
                    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
                    const periodInDays = company.communicationPeriodicity * 7;

                    if (daysDiff > periodInDays) {
                        overdue++;
                    } else if (daysDiff === 1 || daysDiff === 0) {
                        today++;
                    }
                    if (commDate > now && (nextScheduled.date === '' || commDate < new Date(nextScheduled.date))) {
                        nextScheduled = { type: comm.type, date: commDate };
                    }
                });

                overdueCountTemp += overdue;
                dueTodayCountTemp += today;

                return {
                    ...company,
                    overdue,
                    today,
                    nextScheduled,
                };
            }));

            setOverdueCount(overdueCountTemp);
            setDueTodayCount(dueTodayCountTemp);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleModalOpen = (companyId) => {
        setSelectedCompanies([companyId]);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedCompanies([]);
    };

    const handleNotificationsClick = () => {
        navigate('/user/notifications');
    };

    const handleViewHistory = (companyId) => {
        navigate(`/user/calendar/${companyId}`);
    };

    const handleLogCommunication = async (companyId, commType, commDate, notes) => {
        const companyRef = doc(db, 'companies', companyId);
        const company = companies.find(comp => comp.id === companyId);
        const updatedCompany = {
            ...company,
            communicationDates: [
                ...company.communicationDates,
                { type: commType, date: commDate, notes: notes }
            ],
        };

        await updateDoc(companyRef, {
            communicationDates: updatedCompany.communicationDates,
        });

        setCompanies(prevCompanies =>
            prevCompanies.map(comp =>
                comp.id === companyId ? updatedCompany : comp
            )
        );
        handleModalClose();
    };

    return (
        <Box padding={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
                <IconButton onClick={handleNotificationsClick}>
                    <Badge badgeContent={overdueCount + dueTodayCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{
                    display: 'flex', justifyContent: 'center',
                    alignItems: 'center', height: '300px'
                }}>
                    <CircularProgress color='black' />
                </Box>
            ) : companies.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    No companies present.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#222' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Company Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Last Five Communications</TableCell>
                                <TableCell sx={{ color: 'white' }}>Next Scheduled Communication</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map((company) => {
                                const communicationDates = Array.isArray(company.communicationDates) ? company.communicationDates : [];
                                const lastCommunications = communicationDates.length > 0
                                    ? communicationDates.filter(comm =>
                                        new Date(comm.date).toLocaleDateString() !== new Date(company.nextScheduled.date).toLocaleDateString()
                                    ).slice(-5)
                                    : [];

                                return (
                                    <TableRow key={company.id} sx={{
                                        backgroundColor: company.overdue > 0 ? 'red' : company.today > 0 ? 'yellow' : 'inherit',
                                    }}>
                                        <TableCell>
                                            <a
                                                href={company.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ textDecoration: 'none', color: 'black' }}
                                            >
                                                {company.name}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {lastCommunications.length > 0 ? (
                                                lastCommunications.map((comm, index) => (
                                                    <Tooltip key={index} title={comm.notes || 'No notes available'} placement="top">
                                                        <Typography variant="body2">
                                                            {comm.type} - {new Date(comm.date).toLocaleDateString()}
                                                        </Typography>
                                                    </Tooltip>
                                                ))
                                            ) : (
                                                <Typography variant="body2">No communications</Typography>
                                            )}
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
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ color: 'white', backgroundColor: '#333' }}
                                                    onClick={() => handleModalOpen(company.id)}
                                                >
                                                    Log Communication
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ color: 'white', backgroundColor: '#333' }}
                                                    onClick={() => handleViewHistory(company.id)}
                                                >
                                                    Calendar
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <CommunicationAction
                open={openModal}
                onClose={handleModalClose}
                selectedCompanies={selectedCompanies}
                onLogCommunication={handleLogCommunication}
            />
        </Box>
    );
};

export default UserDashboard;
