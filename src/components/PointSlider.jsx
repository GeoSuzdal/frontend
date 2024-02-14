import React from 'react';
import { Button } from "@geist-ui/core";
import { Icon } from '@iconify/react';

const PointSlider = ({ onButtonLeft, onButtonRight }) => {
    return (
        <>
            <Button
                width={"96px"}
                height={"64px"}
                style={{
                    position: "absolute",
                    left: 0, // added this line
                    top: "50%",
                    transform: "translateY(-50%)"
                }}
                onClick={onButtonLeft}
            >
                <Icon
                    icon="ph:arrow-up-bold"
                    rotate={3}
                    style={{ transform: "scale(3)" }}
                />
            </Button>
            <Button
                width={"96px"}
                height={"64px"}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: "translateY(-50%)"
                }}
                onClick={onButtonRight}
            >
                <Icon
                    icon="ph:arrow-up-bold"
                    rotate={1}
                    style={{ transform: "scale(3)" }}
                />
            </Button>
        </>
    );
};

export default PointSlider;
