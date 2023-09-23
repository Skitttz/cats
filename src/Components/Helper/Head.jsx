import React from "react";

const Head = (props) => {
  React.useEffect(() => {
    document.title = props.title + " | Cats";
  }, [props]);
  return <></>;
};

export default Head;
