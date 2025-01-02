import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import "../App.css";

const CalendarView = () => {
    const [communications, setCommunications] = useState([]);
    const [name, setName] = useState();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { companyId } = useParams();

    useEffect(() => {
        const fetchCommunications = async () => {
            try {
                const companyRef = doc(db, 'companies', companyId);
                const companyDoc = await getDoc(companyRef);

                if (companyDoc.exists()) {
                    const companyData = companyDoc.data();
                    setName(companyData.name);
                    const allCommunications = [];

                    if (companyData.communicationDates && Array.isArray(companyData.communicationDates)) {
                        companyData.communicationDates.forEach(comm => {
                            if (comm.date) {
                                const isFuture = new Date(comm.date) > new Date();
                                const eventColor = isFuture ? 'blue' : 'green';

                                allCommunications.push({
                                    title: comm.type || 'No Type',
                                    date: comm.date,
                                    backgroundColor: eventColor,
                                    borderColor: eventColor,
                                });
                            }
                        });
                    }

                    setCommunications(allCommunications);
                }
            } catch (error) {
                console.error('Error fetching communications:', error);
            }
        };

        if (companyId) {
            fetchCommunications();
        }
    }, [companyId]);

    return (
        <Box padding={4}>
            {name && (
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                    Communication Calendar of {name}
                </Typography>
            )}
            <Box
                sx={{
                    height: isSmallScreen ? '20rem' : '30rem',
                }}
            >
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={communications}
                    height="100%"
                />
            </Box>
        </Box>
    );
};

export default CalendarView;
