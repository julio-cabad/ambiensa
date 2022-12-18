import React from 'react';
import {TouchableOpacity} from 'react-native';
import tw from 'twrnc';

function IconButton(props) {

    const {onPress, icon, color, disabled} = props;

    return (
        <TouchableOpacity style={[{backgroundColor: color, width: 40, height: 40, borderRadius: 20},
            tw`items-center justify-center`]} disabled={disabled}
                          onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );

}

export default IconButton;
