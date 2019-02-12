import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StepButton from "@material-ui/core/es/StepButton/StepButton";
const { Provider, Node } = require("@nteract/mathjax");

const styles = theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

class StepperNN extends React.Component {
    state = {
        activeStep: 0,
        completed: new Set(),
    };

    getSteps = () => {
        return ['Initial', 'Multiple input with weight', 'Multiple output with weight', 'Deviation of error', 'Summary error',
            'Deviation of Sigmoid 1', 'Deviation of Sigmoid 2', 'Correction coeff. 1', 'Correction coeff. 2',  'Weight correction 1', 'Weight correction 2'];
    };

    setStep = (activeStep) => {
        this.setState({activeStep});
    };

    handleNext = () => {
        const { activeStep } = this.state;
        const currentStep = activeStep + 1;
        this.props.setStepDescription(currentStep);
        this.setStep(currentStep);
    };

    handleBack = () => {
        const { activeStep } = this.state;
        const currentStep = activeStep - 1;
        this.props.setStepDescription(currentStep);
        this.setStep(currentStep);
    };

    handleStep = step => () => {
        const currentStep = step;
        this.props.setStepDescription(currentStep);
        this.setStep(currentStep);
    };


    handleReset = () => {
        const currentStep = 0;
        this.props.setStepDescription(currentStep);
        this.setStep(currentStep);
    };

    isStepComplete(step) {
        return step < this.state.activeStep;
    }

    render() {
        const { classes } = this.props;
        const steps = this.getSteps();
        const { activeStep } = this.state;

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep} editable alternativeLabel>
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepButton
                                    onClick={this.handleStep(index)}
                                    completed={this.isStepComplete(index)}
                                >
                                    {label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className={'stepButton'}>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                One cycle of trainin completed - algo take the next Data and start again.
                            </Typography>
                            <Button onClick={this.handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}
                                    className={classes.button}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNext}
                                    className={classes.button}
                                >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StepperNN);
