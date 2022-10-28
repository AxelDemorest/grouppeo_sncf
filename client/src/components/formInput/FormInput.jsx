import { useState } from 'react';
import styled from 'styled-components';
import './formInput.css';

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const { width, label, errorMessage, onChange, id, ...inputProps } = props;

    const handleFocus = (e) => {
        setFocused(true);
    };

    return (
        <FormGroup>
            <FormLabel>{label}</FormLabel>
            <input className='singleFormInput'
                style={{ width: width }}
                {...inputProps}
                onChange={onChange}
                onBlur={handleFocus}
                onFocus={() => inputProps.name === "confirmPassword" && setFocused(true)}
                focused={focused.toString()}
            />
            <FormError>{errorMessage}</FormError>
        </FormGroup>
    );
};

const FormGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const FormLabel = styled.div`
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
`;

const FormError = styled.div`
    font-size: 12px;
    font-weight: 700;
    margin-top: 7px;
    color: #d01e1e;
    display: none;
`;

export default FormInput;