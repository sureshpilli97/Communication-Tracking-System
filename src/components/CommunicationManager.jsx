import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox, FormControlLabel, Box, Typography, CircularProgress } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const CommunicationManager = () => {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchMethods = async () => {
            setLoading(true);
            const methodsCollection = collection(db, 'communication_methods');
            const methodsSnapshot = await getDocs(methodsCollection);
            const methodsList = methodsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMethods(methodsList);
            setLoading(false);
        };
        fetchMethods();
    }, []);

    const handleAddMethod = async (values) => {
        setLoading(true);
        try {
            const addedDoc = await addDoc(collection(db, 'communication_methods'), values);
            setMethods([...methods, { id: addedDoc.id, ...values }]);
        } catch (error) {
            console.error('Error adding communication method:', error);
        }
        setLoading(false);
    };

    const handleDeleteMethod = async (id) => {
        try {
            await deleteDoc(doc(db, 'communication_methods', id));
            setMethods(methods.filter(method => method.id !== id));
        } catch (error) {
            console.error('Error deleting communication method:', error);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        sequence: Yup.number().required('Sequence is required').positive().integer(),
        mandatory: Yup.bool(),
    });

    return (
        <Box padding={4}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                Manage Communication Methods
            </Typography>

            <Formik
                initialValues={{ name: '', description: '', sequence: methods.length + 1, mandatory: false }}
                validationSchema={validationSchema}
                onSubmit={handleAddMethod}
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form>
                        <Box sx={{
                            mb: 2, display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: 2
                        }}>
                            <Field
                                name="name"
                                as={TextField}
                                label="Method Name"
                                value={values.name}
                                onChange={handleChange}
                                required
                                fullWidth
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                            <Field
                                name="description"
                                as={TextField}
                                label="Description"
                                value={values.description}
                                onChange={handleChange}
                                required
                                fullWidth
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                            <Field
                                name="sequence"
                                as={TextField}
                                label="Sequence"
                                type="number"
                                value={values.sequence}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={touched.sequence && Boolean(errors.sequence)}
                                helperText={touched.sequence && errors.sequence}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.mandatory}
                                        onChange={(e) => handleChange({
                                            target: {
                                                name: 'mandatory',
                                                value: e.target.checked
                                            }
                                        })}
                                    />
                                }
                                label="Mandatory"
                            />
                            <Button
                                variant="contained"
                                sx={{ background: 'black' }}
                                type="submit"
                                disabled={loading}
                                fullWidth
                            >
                                {loading && values.name ? <CircularProgress color="white" size={24} /> : 'Add Method'}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>

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
            ) : methods.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#222' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Method Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white' }}>Sequence</TableCell>
                                <TableCell sx={{ color: 'white' }}>Mandatory</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {methods
                                .sort((a, b) => a.sequence - b.sequence)
                                .map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>{method.name}</TableCell>
                                        <TableCell>{method.description}</TableCell>
                                        <TableCell>{method.sequence}</TableCell>
                                        <TableCell>{method.mandatory ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDeleteMethod(method.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                    No communication methods found
                </Typography>
            )}
        </Box>
    );
};

export default CommunicationManager;