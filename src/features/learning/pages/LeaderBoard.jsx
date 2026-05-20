import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {

   const [leaders, setLeaders] = useState([]);

   useEffect(() => {

      axios.get("http://127.0.0.1:8000/leaderboard")
      .then((res) => {
         setLeaders(res.data);
      });

   }, []);

   return (
      <div className="p-4">

         <h1 className="text-2xl font-bold mb-4">
            Leaderboard
         </h1>

         {leaders.map((user, index) => (
            <div
               key={index}
               className="flex justify-between bg-white p-3 mb-2 rounded-lg shadow"
            >
               <span>{user.username}</span>
               <span>{user.xp} XP</span>
            </div>
         ))}

      </div>
   );
}