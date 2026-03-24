    import React, { useState, useEffect } from "react";
    import "./Team.css";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";

    function Invoice(){

      // ===== TABLE DATA =====
      const [invoices,setInvoices] = useState([]);

      // ===== FORM DATA =====
      const [invoiceNo,setInvoiceNo] = useState("");
      const [studentName,setStudentName] = useState("");
      const [phone,setPhone] = useState("");
      const [email,setEmail] = useState("");
      
      const [course,setCourse] = useState([]);   // array from API
      const [selectedCourse,setSelectedCourse] = useState(""); // chosen value

      const [courseFee,setFee] = useState("");
      const [referredBy,setreferredBy]= useState("");
      const [discount,setDiscount] = useState("");

      const [editId,setEditId] = useState(null);

                    
const downloadPDF = (inv) => {

  const doc = new jsPDF({
    unit: "mm",
    format: [80, 250]
  });

  // ========= SAFE DATA =========
  const courseName =
    typeof inv.course === "object"
      ? inv.course?.courseName || "-"
      : inv.course || "-";

  const fee = Number(inv.courseFee) || 0;
  const discount = Number(inv.discount) || 0;
  const total = fee - discount;

  const money = (val) => `Rs. ${Number(val).toFixed(2)}`;

  // ========= HEADER =========
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SOFTECH INSTITUTE", 40, 12, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Suvidha Marg, Aggarsain Colony ", 40, 17, { align: "center" });
  doc.text("Sirsa, Haryana - 125055", 40, 21, { align: "center" });
  doc.text("Phone: 99966-70050", 40, 25, { align: "center" });

  doc.line(5, 28, 75, 28);

  // ========= INVOICE INFO =========
  doc.setFontSize(9);
  doc.text(`Invoice No : ${inv.invoiceNo || "-"}`, 5, 34);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, 5, 39);

  doc.line(5, 42, 75, 42);

  // ========= STUDENT INFO =========
  doc.text(`Student : ${inv.studentName || "-"}`, 5, 48);
  doc.text(`Phone   : ${inv.phone || "-"}`, 5, 53);
  doc.text(`Email   : ${inv.email || "-"}`, 5, 58);

  doc.line(5, 62, 75, 62);

  // ========= COURSE TABLE =========
  autoTable(doc, {
    startY: 66,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 2
    },
    headStyles: {
      fontStyle: "bold"
    },
    head: [["Course", "Fee"]],
    body: [
      [courseName, money(fee)]
    ],
    margin: { left: 5, right: 5 }
  });

  let y = doc.lastAutoTable.finalY + 5;

  // ========= PRICE SECTION =========
  doc.line(5, y, 75, y);
  y += 6;

  doc.text(`Course Fee :`, 5, y);
  doc.text(money(fee), 70, y, { align: "right" });

  y += 6;

  doc.text(`Discount :`, 5, y);
  doc.text(`- ${money(discount)}`, 70, y, { align: "right" });

  y += 6;

  doc.line(5, y, 75, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`TOTAL AMOUNT`, 5, y);
  doc.text(money(total), 70, y, { align: "right" });

  y += 12;

  // ========= FOOTER =========
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Softech!", 40, y, { align: "center" });
  doc.text("Visit Again", 40, y + 4, { align: "center" });

  // ========= SAVE =========
  doc.save(`${inv.invoiceNo || "invoice"}.pdf`);
};
      // ===== GET INVOICE =====
      const fetchInvoices = async ()=>{
        try{
          const res = await fetch("http://localhost:2000/getinvoice");
          const data = await res.json();
          setInvoices(data.data || []);
        }catch(err){
          console.log(err);
        }
      };

      useEffect(()=>{
        fetchInvoices();
      },[]);

      // ===== GET COURSE =====
      const fetchCourse = async ()=>{
        try{
          const res = await fetch("http://localhost:2000/getcdata");
          const data = await res.json();
          setCourse(data.data || []);
        }catch(err){
          console.log(err);
        }
      };

      useEffect(()=>{
        fetchCourse();
      },[]);



      // ===== SAVE / UPDATE =====
      const handleSave = async (e)=>{
        e.preventDefault();

        const body = {
          invoiceNo,
          studentName,
          phone,
          email,
          course: selectedCourse,
          courseFee,
          referredBy,
          discount
        };

        try{

          if(editId){
            await fetch(`http://localhost:2000/putinvoice/${editId}`,{
              method:"PUT",
              headers:{ "Content-Type":"application/json"},
              body:JSON.stringify(body)
            });
          }else{
            await fetch("http://localhost:2000/postinvoice",{
              method:"POST",
              headers:{ "Content-Type":"application/json"},
              body:JSON.stringify(body)
            });
          }

          // clear form
          setInvoiceNo("");
          setStudentName("");
          setPhone("");
          setEmail("");
          setSelectedCourse("");
          setFee("");
          setreferredBy("");
          setDiscount("");
          setEditId(null);

          fetchInvoices();
          fetchCourse();
        }catch(err){
          console.log(err);
        }
      };


      // ===== DELETE =====
      const handleDelete = async(id)=>{
        if(!window.confirm("Delete this invoice?")) return;

        await fetch(`http://localhost:2000/deleteinvoice/${id}`,{
          method:"DELETE"
        });

        fetchInvoices();
        fetchCourse();
      };


      // ===== EDIT =====
      const handleEdit = (i)=>{
  setInvoiceNo(i.invoiceNo || "");
  setStudentName(i.studentName || "");
  setPhone(i.phone || "");
  setEmail(i.email || "");

  const courseName =
    typeof i.course === "object"
      ? i.course?.courseName
      : i.course || "";

  setSelectedCourse(courseName);

  setFee(i.courseFee || "");
  setreferredBy(i.referredBy || "");
  setDiscount(i.discount || "");
  setEditId(i._id);
};
    return (

    <div className="content-card">

    <h2>Invoice Management</h2>

    <form onSubmit={handleSave} className="team-form">

    <input placeholder="Invoice No" value={invoiceNo}
    onChange={e=>setInvoiceNo(e.target.value)} />

    <input placeholder="Student Name" value={studentName}
    onChange={e=>setStudentName(e.target.value)} />

    <input placeholder="Phone" value={phone}
    onChange={e=>setPhone(e.target.value)} />

    <input placeholder="Email" value={email}
    onChange={e=>setEmail(e.target.value)} />
    
    

    <select
value={selectedCourse}
onChange={(e)=>{
  const value = e.target.value;
  setSelectedCourse(value);

  // auto fill fee from course API
  const found = course.find(c => c.courseName === value);
  if(found){
    setFee(found.fee);
  }
}}
>

<option value="">Select Course</option>

{course.map((c)=>(
<option key={c._id} value={c.courseName}>
{c.courseName}
</option>
))}

</select>

    <input placeholder="Fee" value={courseFee}
    onChange={e=>setFee(e.target.value)} />

    <input placeholder="Referred By" value={referredBy}
    onChange={e=>setreferredBy(e.target.value)} />

    <input placeholder="Discount" value={discount}
    onChange={e=>setDiscount(e.target.value)} />

    <button type="submit">
    {editId ? "Update" : "Save"}
    </button>

    </form>


    <table className="team-table">

    <thead>
    <tr>
    <th>Invoice-No</th>
    <th>Student</th>
    <th>Phone</th>
    <th>Email</th>
    <th>Course</th>
    <th>Fee</th>
    <th>Discount</th>
    <th>Referral</th>
    <th>Action</th>
    </tr>
    </thead>

    <tbody>

    {invoices.length > 0 ? (

    invoices.map((i)=>(
    <tr key={i._id}>
    <td>{i.invoiceNo}</td>
    <td>{i.studentName}</td>
    <td>{i.phone}</td>
    <td>{i.email}</td>
    <td>
{typeof i.course === "object"
  ? i.course?.courseName || i.course?.courseName || "-"
  : i.course}
</td>
    <td>{i.courseFee}</td>
    <td>{i.discount}</td>
    <td>{i.referredBy}</td>
    <td>

    <button onClick={()=>handleEdit(i)}>Edit</button>

    <button onClick={()=>handleDelete(i._id)}>
    Delete
    </button>

<button onClick={() => downloadPDF(i)}>
Download
</button>

    </td>
    </tr>
    ))

    ) : (

    <tr>
    <td colSpan="6">No Invoice found</td>
    </tr>

    )}

    </tbody>

    </table>



    </div>
      );
    }

    export default Invoice;