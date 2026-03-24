import { useState, useEffect } from "react";
import "./Team.css";

function Course(){

  const [courses,setCourses] = useState([]);
  const [name,setName] = useState("");
  const [duration,setduration] = useState("");
  const [fee,setfee] = useState("");
  const [editId,setEditId] = useState(null);

  // ===== GET TEAM =====
  const fetchCourses = async ()=>{
    try{
      const res = await fetch("http://localhost:2000/getcdata");
      const data = await res.json();
      setCourses(data.data || []);
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchCourses();
  },[]);

  // ===== SAVE / UPDATE =====
  const handleSave = async (e)=>{
    e.preventDefault();

    const coursedata = { name,duration,fee };

    try{

      if(editId){
        await fetch(`http://localhost:2000/putcdata/${editId}`,{
          method:"PUT",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify(coursedata)
        });
      }else{
        await fetch("http://localhost:2000/postcdata",{
          method:"POST",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify(coursedata)
        });
      }

      setName("");
      setduration("");
      setfee("");
      setEditId(null);

      fetchCourses();

    }catch(err){
      console.log(err);
    }
  };

  // ===== DELETE =====
  const handleDelete = async(id)=>{
    if(!window.confirm("Delete this member?")) return;

    try{
      await fetch(`http://localhost:2000/deletecdata/${id}`,{
        method:"DELETE"
      });
      fetchCourses();
    }catch(err){
      console.log(err);
    }
  };

  // ===== EDIT =====
  const handleEdit = (c)=>{
    setName(c.name || "");
    setduration(c.email || "");
    setfee(c.phone || "");
    setEditId(c._id);
  };



  return (

<div className="content-card">

<h2>Course Management</h2>

<form onSubmit={handleSave} className="team-form">

<input
placeholder="Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
placeholder="Duration"
value={duration}
onChange={e=>setduration(e.target.value)}
/>

<input
placeholder="Fee"
value={fee}
onChange={e=>setfee(e.target.value)}
/>

<button type="submit">
{editId ? "Update" : "Save"}
</button>

</form>


<table className="team-table">

<thead>
<tr>
<th>Course</th>
<th>Duration</th>
<th>Fees</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{courses.map((c,index)=>(
<tr key={index}>
<td>{c.courseName}</td>
<td>{c.duration}</td>
<td>{c.fee}</td>
<td>

<button onClick={()=>handleEdit(c)}>Edit</button>

<button onClick={()=>handleDelete(c._id)}>
Delete
</button>

</td>
</tr>
))}

</tbody>

</table>

</div>
  );
}

export default Course;
