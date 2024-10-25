// /* page.tsx */

// "use client";
// import { Posts, getPostsData } from "@/services/tests";
// import { useEffect, useState } from "react";

// const defaultPosts: Posts = {
//     id: 0,
//     title: "",
//     content: "",
//     author: "",
// };

// export default function Page() {
//     const [posts, getPosts] = useState<Posts[]>([defaultPosts]);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             const postsData = await getPostsData();
//             getPosts(postsData);
//         } catch {
//             throw new Error("Failed to fetch posts data");
//         }
//     };

//     return (
//         <div>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                     <thead>
//                         <tr>
//                             <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
//                                 제목
//                             </th>
//                             <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
//                                 내용
//                             </th>
//                             <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
//                                 작성자
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {posts.map((post) => (
//                             <tr key={post.id}>
//                                 <td className="px-6 py-4 whitespace-no-wrap">{post.title}</td>
//                                 <td className="px-6 py-4 whitespace-no-wrap">{post.content}</td>
//                                 <td className="px-6 py-4 whitespace-no-wrap">{post.author}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
