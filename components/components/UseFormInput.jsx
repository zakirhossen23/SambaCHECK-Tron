import React, { useState } from 'react';
import { TextInput } from '@heathmont/moon-core-tw';

export default function UseFormInput({ defaultValue, type, placeholder, id ,disabled=false}) {
	const [value, setValue] = useState(defaultValue || '');
	const input = (
(!disabled)?<TextInput 			
    value={value || ''}
    placeholder={placeholder}
    onChange={(e) => setValue(e.target.value)}
    type={type}
    id={id}
    />:<TextInput 			
    value={value || ''}
    placeholder={placeholder}
    onChange={(e) => setValue(e.target.value)}
    type={type}
    disabled
    id={id}
    />);
	return [value, input, setValue];
}
