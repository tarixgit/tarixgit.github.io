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

function getSteps() {
    return ['Multiple input with weight', 'Multiple output with weight', 'Deviation of error', 'Summary error',
        'Deviation of Sigmoid 1', 'Deviation of Sigmoid 2', 'Correction 1', 'Correction 2',  'Weight correction 1', 'Weight correction 2'];
}

// function getStepContent(step) {
//     switch (step) {
//         case 0:
//             return String.raw`\overrightarrow{O^1} = S(\overrightarrow{O}, W_1)`;
//         case 1:
//             return String.raw`\overrightarrow{O^2} = S(\overrightarrow{O^1}, W_2)`;
//         case 2:
//             return String.raw`\overrightarrow{e} = \begin{pmatrix} O^2_1 - t_1 \\ O^2_2 - t_2 \\ \vdots \\ O^2_m - t_m \\ \end{pmatrix}`;
//         case 3:
//             return String.raw`E = \frac{1}{2}\{(O^2_1 - t_1)^2 + (O^2_2 - t_2)^2 + ... +(O^2_m - t_m)^2\}`;
//         case 4:
//             return String.raw`D_2 = \begin{pmatrix} O^2_1(1 - O^2_1) & \cdots & \cdots \\ \cdots & O^2_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^2_m(1 - O^2_m)\\ \end{pmatrix}`;
//         case 5:
//             return String.raw`D_1 = \begin{pmatrix} O^1_1(1 - O^1_1) & \cdots & \cdots \\ \cdots & O^1_2(1 - O^2_2) & \cdots \\ \cdots & \cdots & O^1_k(1 - O^1_k)\\ \end{pmatrix}`;
//         case 6:
//             return String.raw`\overrightarrow{\delta^2} = D_2 * \overrightarrow{e}`;
//         case 7:
//             return String.raw`\overrightarrow{\delta^1} = D_1 * W_2 * \overrightarrow{e}`;
//         case 8:
//             return String.raw`\overrightarrow{\Delta w_2^T} = - \gamma * \overrightarrow{\delta^2}`;
//         case 9:
//             return String.raw`\overrightarrow{\Delta w_1^T} = - \gamma * \overrightarrow{\delta^1}`;
//         default:
//             return 'learning rate step';
//     }
// }

class StepperNN extends React.Component {
    state = {
        activeStep: 0,
        completed: new Set(),
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
        const steps = getSteps();
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
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
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
