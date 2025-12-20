import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAsync, clearError, clearCreatedFlag } from '../../Services/Actions/AuthActions';
import { FaUserPlus, FaHotel, FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [validated, setValidated] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated, isLoading, errorMsg, isCreated } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        if (isCreated) {
            setTimeout(() => {
                dispatch(clearCreatedFlag());
                navigate('/login');
            }, 2000);
        }
    }, [isAuthenticated, isCreated, navigate, dispatch]);

    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const validatePasswords = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false || !validatePasswords()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const { confirmPassword, ...userData } = formData;
        dispatch(signUpAsync(userData));
        setValidated(true);
    };

    return (
        <Container fluid
            className="d-flex align-items-center justify-content-center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                margin: 0,
                paddingTop: '730px', 
                overflowY: 'auto',
                zIndex: 1
            }}
        >
            <Row className="w-100 justify-content-center mx-0">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="px-3 px-sm-4 my-5 py-5">
                    {/* Back to Home Link - Top */}
                    <div className="mb-4">
                        <Link
                            to="/"
                            className="text-decoration-none d-inline-flex align-items-center text-white fw-medium"
                            style={{ fontSize: '1rem' }}
                        >
                            <FaArrowLeft className="me-2" />
                            Back to Home
                        </Link>
                    </div>

                    <Card className="shadow-lg border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
                        {/* Header Section with Gradient */}
                        <div className="text-center py-4"
                            style={{
                                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                                color: 'white'
                            }}
                        >
                            <div className="bg-white rounded-circle p-3 d-inline-flex mb-3 shadow-sm">
                                <FaHotel size={40} className="text-warning" />
                            </div>
                            <h2 className="fw-bold mb-2">Create Account</h2>
                            <p className="opacity-90 mb-0">Join LuxuryStay for the best hotel experience</p>
                        </div>

                        <Card.Body className="p-4 p-md-5">
                            {/* Success Message */}
                            {isCreated && (
                                <Alert variant="success" className="mb-4 border-0 shadow-sm d-flex align-items-center"
                                    style={{ borderRadius: '10px' }}>
                                    <div className="flex-shrink-0">
                                        <FaUserPlus className="text-success me-2" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <strong>Success!</strong> Account created successfully. Redirecting to login...
                                    </div>
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {errorMsg && (
                                <Alert variant="danger" className="mb-4 border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <FaEnvelope className="text-danger" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <strong className="d-block mb-1">Registration Error</strong>
                                            <span className="text-muted">{errorMsg}</span>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {/* Registration Form */}
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Full Name</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaUser className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                        Please enter your name.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Email Address</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaEnvelope className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                        Please enter a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Phone Number <span className="text-muted fw-normal">(Optional)</span></Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaPhone className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaLock className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                            isInvalid={!!passwordError}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                        {passwordError || 'Password must be at least 6 characters.'}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Confirm Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaLock className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm your password"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                            isInvalid={!!passwordError}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                        {passwordError || 'Please confirm your password.'}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="terms-check"
                                        label={
                                            <>
                                                I agree to the{' '}
                                                <Link to="/terms" className="text-decoration-none fw-bold text-primary">
                                                    Terms & Conditions
                                                </Link>{' '}
                                                and{' '}
                                                <Link to="/privacy" className="text-decoration-none fw-bold text-primary">
                                                    Privacy Policy
                                                </Link>
                                            </>
                                        }
                                        required
                                        className="fw-medium"
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="warning"
                                    className="w-100 py-3 mb-3 fw-bold shadow"
                                    disabled={isLoading}
                                    style={{
                                        background: 'linear-gradient(135deg, #ff9800, #ff5722)',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.2)';
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus className="me-2" />
                                            Create Account
                                        </>
                                    )}
                                </Button>
                            </Form>

                            {/* Login Link */}
                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-2">
                                    Already have an account?
                                </p>
                                <Link
                                    to="/login"
                                    className="btn btn-outline-primary fw-bold px-4"
                                    style={{
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Sign In Instead
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;