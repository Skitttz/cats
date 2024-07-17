// import React from "react";
// import { PHOTO_LIKE_GET } from "../../Api/index";
// import useFetch from "../../Hooks/useFetch";

// const PhotoTotalLike = ({ id }) => {
//   const { error, request } = useFetch();
//   const [total, setTotal] = React.useState(0);

//   React.useEffect(() => {
//     async function getTotalLikes() {
//       const { url, options } = PHOTO_LIKE_GET(id);
//       const { response, json } = await request(url, options);
//       if (response.ok) {
//         console.log(json);
//         setTotal(json.total_likes);
//       }
//     }
//     getTotalLikes();
//   }, [id, request]);
//   return <span>{total}</span>;
// };

// export default PhotoTotalLike;
