import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInAsync, signInWithGoogleAsync, clearError } from '../../Services/Actions/AuthActions';
import { FaGoogle, FaSignInAlt, FaHotel, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated, isLoading, errorMsg } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            dispatch(signInAsync({ email, password }));
        }

        setValidated(true);
    };

    const handleGoogleSignIn = () => {
        dispatch(signInWithGoogleAsync());
    };

    return (
        <Container fluid className="mt-0 d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', margin: 0 }}>

            <Row className="w-100 justify-content-center mx-0">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="px-3 px-sm-4 my-1 py-4">
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
                                background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                                color: 'white'
                            }}
                        >
                            <div className="bg-white rounded-circle p-3 d-inline-flex mb-3 shadow-sm">
                                <FaHotel size={40} className="text-primary" />
                            </div>
                            <h2 className="fw-bold mb-2">Welcome Back</h2>
                            <p className="opacity-90 mb-0">Sign in to your LuxuryStay account</p>
                        </div>

                        <Card.Body className="p-4 p-md-5">
                            {/* Error Alert */}
                            {errorMsg && (
                                <Alert variant="danger" className="mb-4 border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <FaEnvelope className="text-danger" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <strong className="d-block mb-1">Authentication Error</strong>
                                            <span className="text-muted">{errorMsg}</span>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {/* Google Sign In Button */}
                            <Button
                                variant="outline-danger"
                                className="w-100 mb-4 d-flex align-items-center justify-content-center py-3"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                style={{
                                    borderRadius: '10px',
                                    borderWidth: '2px',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                <FaGoogle className="me-3" size={18} />
                                Continue with Google
                            </Button>

                            <div className="position-relative text-center my-4">
                                <hr className="w-100" />
                                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                                    or continue with email
                                </span>
                            </div>

                            {/* Login Form */}
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-medium mb-2">Email Address</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaEnvelope className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-medium mb-0">Password</Form.Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-decoration-none text-primary fw-medium"
                                            style={{ fontSize: '0.875rem' }}
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <FaLock className="text-primary" />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                            className="border-start-0 ps-0"
                                            style={{ height: '50px' }}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                        Password must be at least 6 characters.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="remember-me"
                                        label="Remember me"
                                        className="fw-medium"
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 py-3 mb-3 fw-bold shadow"
                                    disabled={isLoading}
                                    style={{
                                        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(26, 35, 126, 0.2)';
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
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <FaSignInAlt className="me-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </Form>

                            {/* Register Link */}
                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-2">
                                    Don't have an account?
                                </p>
                                <Link
                                    to="/register"
                                    className="btn btn-outline-primary fw-bold px-4"
                                    style={{
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Create New Account
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;