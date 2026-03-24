import { useState, useEffect } from "react";
import "./Team.css";

function Team(){

  const [members,setMembers] = useState([]);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [editId,setEditId] = useState(null);

  // ===== GET TEAM =====
  const fetchMembers = async ()=>{
    try{
      const res = await fetch("http://localhost:2000/gettmdata");
      const data = await res.json();
      setMembers(data.data || []);
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchMembers();
  },[]);

  // ===== SAVE / UPDATE =====
  const handleSave = async (e)=>{
    e.preventDefault();

    const teamdata = { name,email,phone };

    try{

      if(editId){
        await fetch(`http://localhost:2000/puttmdata/${editId}`,{
          method:"PUT",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify(teamdata)
        });
      }else{
        await fetch("http://localhost:2000/posttmdata",{
          method:"POST",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify(teamdata)
        });
      }

      setName("");
      setEmail("");
      setPhone("");
      setEditId(null);

      fetchMembers();

    }catch(err){
      console.log(err);
    }
  };

  // ===== DELETE =====
  const handleDelete = async(id)=>{
    if(!window.confirm("Delete this member?")) return;

    try{
      await fetch(`http://localhost:2000/deletetmdata/${id}`,{
        method:"DELETE"
      });
      fetchMembers();
    }catch(err){
      console.log(err);
    }
  };

  // ===== EDIT =====
  const handleEdit = (m)=>{
    setName(m.name || "");
    setEmail(m.email || "");
    setPhone(m.phone || "");
    setEditId(m._id);
  };



  return (

<div className="content-card">

<h2>Team Members</h2>

<form onSubmit={handleSave} className="team-form">

<input
placeholder="Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<input
placeholder="Phone"
value={phone}
onChange={e=>setPhone(e.target.value)}
/>

<button type="submit">
{editId ? "Update" : "Save"}
</button>

</form>


<table className="team-table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{members.map((m,index)=>(
<tr key={index}>
<td>{m.name}</td>
<td>{m.email}</td>
<td>{m.phone}</td>
<td>

<button onClick={()=>handleEdit(m)}>Edit</button>

<button onClick={()=>handleDelete(m._id)}>
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

export default Team;
