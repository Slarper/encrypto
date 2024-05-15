import React, { useState } from 'react';

interface TextInputerProps {
    initialValue: string;
    Name: string;
}

const TextInputer: React.FC<TextInputerProps> = ({ initialValue, Name }) => {
    const [inputValue, setInputValue] = useState(initialValue);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
            <div>
                {Name}
            </div>
            <div
                style={{ margin: '10px' }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{
                        fontSize: '20px', color: 'white', backgroundColor: '#404040', 
                        minWidth: '700px', outline: 'none', border: 'none', padding: '10px'
                    }} // Inline style
                />
            </div>

        </div>
    );
};

export default TextInputer;
