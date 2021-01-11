import React from 'react';
export default function EsiText(props) {
    //return React.createElement('esi:text', { value: props.params.value }, undefined);
    if (!props.params.value) {
        return;
    }
    return React.createElement("span", { dangerouslySetInnerHTML: {
            __html: props.params.value
        } });
}
//# sourceMappingURL=EsiText.js.map