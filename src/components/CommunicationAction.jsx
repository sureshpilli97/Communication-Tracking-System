import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CommunicationAction = ({ open, onClose, selectedCompanies }) => {
    const [communicationMethods, setCommunicationMethods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCommunicationMethods = async () => {
            try {
                const methodsCollection = collection(db, 'communication_methods');
                const methodsSnapshot = await getDocs(methodsCollection);
                const methodsList = methodsSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => a.sequence - b.sequence);
                setCommunicationMethods(methodsList);
            } catch (error) {
                console.error('Error fetching communication methods:', error);
            }
        };

        fetchCommunicationMethods();
    }, []);

    const validationSchema = Yup.object({
        communicationType: Yup.string().required('Communication type is required'),
        communicationDate: Yup.date().required('Date of communication is required'),
        notes: Yup.string(),
    });

    const handleCommunicationSubmit = async (values, { resetForm }) => {
        try {
            setLoading(true);
            for (let companyId of selectedCompanies) {
                const companyRef = doc(db, 'companies', companyId);
                const companyDoc = await getDoc(companyRef);
                const companyData = companyDoc.data();

                const newCommunication = {
                    type: values.communicationType,
                    date: values.communicationDate,
                    notes: values.notes,
                };

                await updateDoc(companyRef, {
                    communicationDates: [...(companyData.communicationDates || []), newCommunication],
                });
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error('Error updating communication:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Log Communication</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        communicationType: '',
                        communicationDate: '',
                        notes: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleCommunicationSubmit}
                >
                    {() => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Communication Type</InputLabel>
                                <Field
                                    name="communicationType"
                                    as={Select}
                                    label="Communication Type"
                                >
                                    {communicationMethods.map((method) => (
                                        <MenuItem key={method.id} value={method.name}>
                                            {method.name}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </FormControl>
                            <ErrorMessage name="communicationType" component="div" style={{ color: 'red' }} />

                            <Field
                                name="communicationDate"
                                as={TextField}
                                fullWidth
                                label="Date of Communication"
                                type="date"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                            <ErrorMessage name="communicationDate" component="div" style={{ color: 'red' }} />

                            <Field
                                name="notes"
                                as={TextField}
                                fullWidth
                                label="Notes"
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <ErrorMessage name="notes" component="div" style={{ color: 'red' }} />

                            <DialogActions>
                                <Button sx={{ color: 'black' }} onClick={onClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    sx={{ background: 'black' }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress color="white" size={24} /> : 'Log Communication'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default CommunicationAction;
