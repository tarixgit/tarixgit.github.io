import React, {Component} from 'react';
import './Trainig.css';
import Training from "./Training";
import NeuralNetwork from "./NeuralNetwork";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
    root: {
        maxWidth: "100%",
        flexGrow: 1,
    },
    buttonLeft: {
        position: "absolute",
        bottom: "3px",
        left: "0",
    },
    buttonRight: {
        position: "absolute",
        bottom: "3px",
        right: "0",
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        maxWidth: "100%",
        overflow: 'hidden',
        display: 'block',
        width: '100%',
    },
});


class MainComponent extends Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    render () {
        const { activeStep } = this.state;
        const { classes, theme } = this.props;
        const maxSteps = 2;
        return (
            <div className={classes.root}>
                {activeStep == 0 && <Training />}
                {activeStep == 1 && <NeuralNetwork />}
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    variant="text"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    backButton={
                        <Button size="small" className={classes.buttonLeft} onClick={this.handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                            Training
                        </Button>
                    }
                    nextButton={
                        <Button size="small" className={classes.buttonRight} onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                            Classification
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                />
            </div>
        );
    }
}
MainComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(MainComponent);

