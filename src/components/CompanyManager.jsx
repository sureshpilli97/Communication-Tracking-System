import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const CompanyManager = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [company, setCompany] = useState({
        name: '',
        location: '',
        linkedin: '',
        emails: '',
        phoneNumbers: '',
        comments: '',
        communicationPeriodicity: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (companyId) {
            const fetchCompany = async () => {
                const companyDoc = await getDoc(doc(db, 'companies', companyId));
                if (companyDoc.exists()) {
                    const companyData = companyDoc.data();
                    setCompany({
                        name: companyData.name,
                        location: companyData.location,
                        linkedin: companyData.linkedin,
                        emails: companyData.emails.join(', '),
                        phoneNumbers: companyData.phoneNumbers.join(', '),
                        comments: companyData.comments,
                        communicationPeriodicity: companyData.communicationPeriodicity,
                    });
                }
            };
            fetchCompany();
        }
    }, [companyId]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Company name is required'),
        location: Yup.string().required('Location is required'),
        linkedin: Yup.string().url('Invalid URL format').required('LinkedIn is required'),
        emails: Yup.string().required('Emails are required'),
        phoneNumbers: Yup.string().required('Phone numbers are required'),
        comments: Yup.string(),
        communicationPeriodicity: Yup.string().required('Communication Periodicity is required'),
    });

    const handleSubmit = async (values) => {
        setLoading(true);

        const companyData = {
            ...values,
            emails: values.emails.split(',').map(email => email.trim()),
            phoneNumbers: values.phoneNumbers.split(',').map(phone => phone.trim()),
        };

        try {
            if (companyId) {
                await setDoc(doc(db, 'companies', companyId), companyData);
            } else {
                await setDoc(doc(db, 'companies', new Date().toISOString()), companyData);
            }
            navigate('/admin');
        } catch (error) {
            console.error('Error saving company:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box padding={4}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ mb: 3, fontWeight: 'bold' }}>
                {companyId ? 'Edit Company' : 'Add Company'}
            </Typography>
            <Formik
                initialValues={company}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Field
                                name="name"
                                as={TextField}
                                fullWidth
                                label="Company Name"
                                value={values.name}
                                onChange={handleChange}
                                required
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                            <Field
                                name="location"
                                as={TextField}
                                fullWidth
                                label="Location"
                                value={values.location}
                                onChange={handleChange}
                                required
                                error={touched.location && Boolean(errors.location)}
                                helperText={touched.location && errors.location}
                            />
                            <Field
                                name="linkedin"
                                as={TextField}
                                fullWidth
                                label="LinkedIn Profile"
                                value={values.linkedin}
                                onChange={handleChange}
                                required
                                error={touched.linkedin && Boolean(errors.linkedin)}
                                helperText={touched.linkedin && errors.linkedin}
                            />
                            <Field
                                name="emails"
                                as={TextField}
                                fullWidth
                                label="Emails (comma separated)"
                                value={values.emails}
                                onChange={handleChange}
                                required
                                error={touched.emails && Boolean(errors.emails)}
                                helperText={touched.emails && errors.emails}
                            />
                            <Field
                                name="phoneNumbers"
                                as={TextField}
                                fullWidth
                                label="Phone Numbers (comma separated)"
                                value={values.phoneNumbers}
                                onChange={handleChange}
                                required
                                error={touched.phoneNumbers && Boolean(errors.phoneNumbers)}
                                helperText={touched.phoneNumbers && errors.phoneNumbers}
                            />
                            <Field
                                name="comments"
                                as={TextField}
                                fullWidth
                                label="Comments"
                                value={values.comments}
                                onChange={handleChange}
                            />
                            <Field
                                name="communicationPeriodicity"
                                as={TextField}
                                fullWidth
                                label="Communication Periodicity (e.g., 2)"
                                value={values.communicationPeriodicity}
                                onChange={handleChange}
                                required
                                error={touched.communicationPeriodicity && Boolean(errors.communicationPeriodicity)}
                                helperText={touched.communicationPeriodicity && errors.communicationPeriodicity}
                            />
                            <Button
                                variant="contained"
                                sx={{ background: 'black' }}
                                type="submit"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? <CircularProgress color="white" size={24} /> : (companyId ? 'Update Company' : 'Add Company')}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CompanyManager;
