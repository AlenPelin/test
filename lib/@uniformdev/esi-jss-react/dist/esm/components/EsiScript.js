import React from 'react';
export default function EsiScript(props) {
    return React.createElement("script", { dangerouslySetInnerHTML: { __html: props.params.script } });
    //return React.createElement('esi:text', { value: props.params.script }, undefined);
}
//# sourceMappingURL=EsiScript.js.map