import React, { useState, useEffect } from 'react';
import {
	Grid,
	Paper,
	TextField,
	Checkbox,
	FormGroup,
	FormControlLabel,
	FormControl,
	Button,
	Snackbar,
	Typography,
	Select,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import * as yup from 'yup';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
	paper: {
		backgroundColor: 'black',
		color: 'white',
		margin: '.5rem',
		padding: '.75rem',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	formGroup: {
		marginBottom: '2rem;',
	},
	form: {
		alignSelf: 'stretch',
		marginTop: '2rem',
	},
	mainGrid: {
		margin: '0 auto',

		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},

	error: {
		backgroundColor: red,
		color: 'white',
	},
	cardGrid: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		margin: '0 auto',
	},
	paperGrid: {
		marginBottom: '3rem',
	},
});

const Form = () => {
	const classes = useStyles();

	const [formState, setFormState] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		terms: true,
	});

	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		terms: '',
	});

	const [snackBarOpen, setSnackBarOpen] = useState({
		name: false,
		email: false,
		password: false,
	});

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [users, setUsers] = useState([]);

	const formSchema = yup.object().shape({
		name: yup.string().required('Name is a required field'),
		email: yup
			.string()
			.email('Must be a valid email address')
			.required('Must include email'),
		password: yup.string().required('Password is required.'),
		role: yup
			.mixed()
			.oneOf([
				'',
				'Front-End Dev',
				'Back-End Dev',
				'UX Design',
				'Project Manager',
			])
			.defined(),
		terms: yup.boolean().oneOf([true]),
	});

	useEffect(() => {
		formSchema.isValid(formState).then((isFormValid) => {
			setButtonDisabled(!isFormValid);
		});
	}, [formState]);

	const formSubmit = (e) => {
		e.preventDefault();
		axios
			.post('https://reqres.in/api/users', formState)
			.then((res) => {
				setUsers([...users, res.data]);
				console.log('success');
				setFormState({
					name: '',
					email: '',
					password: '',
					role: '',
					terms: true,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const validateChange = (e) => {
		yup
			.reach(formSchema, e.target.name)
			.validate(e.target.value)
			.then(() => {
				setErrors({
					...errors,
					[e.target.name]: '',
				});
				setSnackBarOpen({
					...snackBarOpen,
					[e.target.name]: false,
				});
			})
			.catch((err) => {
				setErrors({
					...errors,
					[e.target.name]: err.errors[0],
				});
				setSnackBarOpen({
					...snackBarOpen,
					[e.target.name]: true,
				});
			});
	};

	const inputChange = (e) => {
		e.persist();
		const newFormData = {
			...formState,
			[e.target.name]:
				e.target.name === 'terms' ? e.target.checked : e.target.value,
		};
		validateChange(e);
		setFormState(newFormData);
	};

	return (
		<>
			<Grid container className={classes.mainGrid}>
				<Grid item>
					<Typography variant='h1' component='h1' align='center'>
						Employee Login
					</Typography>
				</Grid>
				<Grid item className={classes.form}>
					<form onSubmit={formSubmit}>
						<FormGroup className={classes.formGroup}>
							<TextField
								variant='filled'
								label='Name'
								name='name'
								id='name'
								value={formState.name}
								onChange={inputChange}
								error={snackBarOpen.name}
							/>
							<Snackbar
								open={snackBarOpen.name}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							>
								<Alert severity='error'>{errors.name}</Alert>
							</Snackbar>

							<TextField
								variant='filled'
								label='Email'
								name='email'
								id='email'
								value={formState.email}
								onChange={inputChange}
								error={snackBarOpen.email}
							/>
							<Snackbar
								open={snackBarOpen.email}
								anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
							>
								<Alert severity='error'>{errors.email}</Alert>
							</Snackbar>

							<TextField
								variant='filled'
								type='password'
								label='Password'
								name='password'
								id='password'
								value={formState.password}
								onChange={inputChange}
								error={snackBarOpen.password}
							/>
							<Snackbar
								open={snackBarOpen.password}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
							>
								<Alert severity='error'>{errors.password}</Alert>
							</Snackbar>

							<FormControl>
								<Select
									native
									variant='filled'
									name='role'
									id='role'
									onChange={inputChange}
								>
									<option aria-label='None' value=''>
										Choose Position (Optional)
									</option>
									<option value='Front-End Dev'>Front-End Dev</option>
									<option value='Back-End Dev'>Back-End Dev</option>
									<option value='UX Design'>UX Design</option>
									<option value='Project Manager'>Project Manager</option>
								</Select>
							</FormControl>
						</FormGroup>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										name='terms'
										id='terms'
										checked={formState.terms}
										onChange={inputChange}
										color='primary'
									/>
								}
								label='Terms & Conditions'
								labelPlacement='top'
							/>

							<Button
								variant='contained'
								color='primary'
								disabled={buttonDisabled}
								startIcon={<ArrowUpwardIcon />}
								type='submit'
							>
								Submit
							</Button>
						</FormGroup>
					</form>
				</Grid>
			</Grid>
			<Grid container className={classes.cardGrid}>
				{users &&
					users.map((user) => {
						return (
							<Grid item className={classes.paperGrid} key={user.email}>
								<Paper className={classes.paper}>
									<Typography variant='h3'>{user.name}</Typography>
									<Typography variant='subtitle1'>
										Email: {user.email}
									</Typography>
									<Typography variant='subtitle1'>
										Password: {user.password}
									</Typography>
									{user.role && (
										<Typography variant='subtitle1'>
											Role: {user.role}
										</Typography>
									)}
								</Paper>
							</Grid>
						);
					})}
			</Grid>
		</>
	);
};

export default Form;
