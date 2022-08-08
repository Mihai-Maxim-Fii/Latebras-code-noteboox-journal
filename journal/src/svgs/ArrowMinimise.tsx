// icon:arrow-minimise | Typicons https://www.s-ings.com/typicons/ | Stephen Hutchings
import * as React from "react";

function ArrowMinimiseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      baseProfile="tiny"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M6.121 13a1 1 0 100 2h1.465l-3.293 3.293a.999.999 0 101.414 1.414l3.414-3.414V18c0 .552.447 1 1 1s.879-.448.879-1v-5H6.121zM7 11a1 1 0 001-1V8h2a1 1 0 100-2H6.001L6 10a1 1 0 001 1zm10 2a1 1 0 00-1 1v2h-2a1 1 0 100 2h4v-4a1 1 0 00-1-1zm1.293-8.707L15 7.586V6a1 1 0 10-2 0v5h5a1 1 0 000-2h-1.586l3.293-3.292c.391-.391.391-1.023 0-1.414s-1.023-.392-1.414-.001z" />
    </svg>
  );
}

export default ArrowMinimiseIcon;
