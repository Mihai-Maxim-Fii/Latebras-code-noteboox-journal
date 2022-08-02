
// icon:arrow-down | Ant Design Icons https://ant.design/components/icon/ | Ant Design
import * as React from "react";

const ArrowDownIcon:React.FC=(props) =>{
    return (
        <svg
          fill="currentColor"
          viewBox="0 0 16 16"
          height="1.25em"
          width="1.25em"
          {...props}
        >
          <path
            fillRule="evenodd"
            d="M1.5 10.036a.5.5 0 01.5.5v3.5h3.5a.5.5 0 010 1h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z"
          />
          <path
            fillRule="evenodd"
            d="M6.354 9.646a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0zm8.5-8.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0z"
          />
          <path
            fillRule="evenodd"
            d="M10.036 1.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 11-1 0V2h-3.5a.5.5 0 01-.5-.5z"
          />
        </svg>
      );
}

export default ArrowDownIcon;
