import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companiesCollection = collection(db, 'companies');
                const companiesSnapshot = await getDocs(companiesCollection);
                const companiesList = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompanies(companiesList);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
            setLoading(false);
        };
        fetchCompanies();
    }, []);

    const handleDelete = async (companyId) => {
        try {
            const companyDocRef = doc(db, 'companies', companyId);
            await deleteDoc(companyDocRef);
            setCompanies(companies.filter(company => company.id !== companyId));
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    return (
        <Box padding={4}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                Admin Dashboard
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mb: 3,
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    variant="contained"
                    component={Link}
                    to="/admin/add-company"
                    sx={{ minWidth: '150px', backgroundColor: 'black' }}
                >
                    Add Company
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/admin/add-communication"
                    sx={{ minWidth: '150px', backgroundColor: 'black' }}
                >
                    Add Communication
                </Button>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress color='black' />
                </Box>
            ) : companies.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#222' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Location</TableCell>
                                <TableCell sx={{ color: 'white' }}>Emails</TableCell>
                                <TableCell sx={{ color: 'white' }}>Phone Numbers</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map((company) => (
                                <TableRow key={company.id}>
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
                                    <TableCell>{company.location}</TableCell>
                                    <TableCell>{company.emails.join(', ')}</TableCell>
                                    <TableCell>{company.phoneNumbers.join(', ')}</TableCell> 
                                    <TableCell sx={{ display: 'flex' }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            component={Link}
                                            to={`/admin/edit-company/${company.id}`}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDelete(company.id)}
                                            sx={{ ml: 1 }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box
                    sx={{
                        backgroundColor: '#f0f0f0',
                        padding: 4,
                        borderRadius: 2,
                        textAlign: 'center',
                        mt: 3,
                    }}
                >
                    <Typography variant="h6" color="textSecondary">
                        No companies present
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AdminDashboard;
